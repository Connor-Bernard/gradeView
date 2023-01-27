import express, { json } from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import esMain from 'es-main';

class AuthenticationError extends Error{}

const app = express();
app.use(cors());
app.use(json());

// Update below constants for individual implementation
// Get keyfile and oauthclientid from google cloud project with an oauth2 client and a service account
// For keyfile, add a key under the service account and add the json keyfile to the auth folder
const HOSTNAME = '127.0.0.1';
const PORT = 8000;
const SPREADSHEETID = '1kaCebQXcx0DCu0-FNPbJlmF_XfN8QOOyI4LJxg4_J74';
const KEYFILE = './auth/service_account.json';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const OAUTHCLIENTID = '435032403387-5sph719eh205fc6ks0taft7ojvgipdji.apps.googleusercontent.com';

/**
 * Verifies token and gets the associated email.
 * @param {OAuth2Client} oauthClient 
 * @param {String} token 
 * @returns {Promise<String>} user's email
 */
async function getEmailFromIdToken(oauthClient, token){
    try {
        const ticket = await oauthClient.verifyIdToken({
            idToken: token,
            audience: OAUTHCLIENTID
        });
        const payload = ticket.getPayload();
        if(payload['hd'] != 'berkeley.edu'){
            throw new AuthenticationError('domain mismatch');
        }
        return payload['email'];
    } catch (err) {
        throw new AuthenticationError('Could not authenticate authorization token.');
    }
}

async function getProfilePictureFromIdToken(oauthClient, token){
    try {
        const ticket = await oauthClient.verifyIdToken({
            idToken: token,
            audience: OAUTHCLIENTID
        });
        const payload = ticket.getPayload();
        if (payload['hd'] != 'berkeley.edu') {
            throw new AuthenticationError('domain mismatch');
        }
        return payload['picture'];
    } catch (err) {
        throw new AuthenticationError('Could not authenticate authorization token.');
    }
}

/**
 * Gets the row of the spreadsheet corresponding to the provided email.
 * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
 * @param {String} email 
 * @returns {Promise<Boolean>} the user's row, null if invalid
 */
async function getUserRow(apiAuthClient, email){
    const sheets = google.sheets({version: 'v4', auth: apiAuthClient});
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range: 'HAID!B2:B'
    });
    const rows = res.data.values;

    for(let i = 0; i < rows.length; i++){
        if(rows[i][0] == email){
            return 2 + i;
        }
    }
    throw new AuthenticationError('No user with token email found.');
}

/**
 * Gets the user's grades associated with the provided email.
 * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
 * @param {String} email 
 * @returns dictionary of user's grades
 */
async function getUserGrades(apiAuthClient, email){
    const userRow = await getUserRow(apiAuthClient, email);
    const sheets = google.sheets({version: 'v4', auth: apiAuthClient});

    const assignmentsRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range: `HAID!F1:AQ1` 
    });
    const assignmentsRows = assignmentsRes.data.values;

    const gradesRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range: `HAID!F${userRow}:AQ${userRow}`
    });
    const gradesRows = gradesRes.data.values;

    let assignments = []

    // Populate assignments dictionary with grades so far
    for(let i = 0; i < gradesRows[0].length; i++){
        assignments.push({
            'id': i,
            'assignment': assignmentsRows[0][i],
            'grade': gradesRows[0][i]
        });
    }
    
    // Populate rest of dictionary ungraded (comment to only show assignments to date)
    for(let i = gradesRows[0].length; i < assignmentsRows[0].length; i++){
        assignments.push({
            'id': i,
            'assignment': assignmentsRows[0][i],
            'grade': gradesRows[0][i]
        });
    }

    return assignments;
}

/**
 * Get the user's grades using the user's token.
 * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
 * @param {OAuth2Client} oauthClient 
 * @param {String} token 
 * @returns dictionary of user's grades
 */
async function getUserGradesFromToken(apiAuthClient, oauthClient, token){
    return getUserGrades(apiAuthClient, await getEmailFromIdToken(oauthClient, token));
}

async function main(){
    const apiAuthClient = await new google.auth.GoogleAuth({
        keyFile: KEYFILE,
        scopes: SCOPES
    }).getClient();
    const oauthClient = new OAuth2Client(OAUTHCLIENTID);

    /**
     * Middleware for verifying user acceses.
     * @param {any} req 
     * @param {any} res 
     * @param {any} next 
     */
    async function verificationMiddleWare(req, res, next){
        let auth = req.headers['authorization'];
        if(!auth){
            return res.status(401).json({error: 'No Authorization provided.'});
        }
        auth = auth.split(' ');
        // Make sure the user's email is in the google sheet
        try{
            getUserRow(apiAuthClient, await getEmailFromIdToken(oauthClient, auth[1]));
        } catch (e){
            if(e instanceof AuthenticationError){
                return res.status(401).json({ error: 'User not authorized.' });
            } else {
                return res.status(400).json({ error: 'Unknown error.' });
            }
        }
        next();
    }
    app.use(verificationMiddleWare);

    // Use the auth checking of middleware to verify proper auth
    app.get('/api/verifyaccess', (req, res) => {
        return res.status(200).send(true);
    })

    // Responds with json dictionary caller's grade data
    app.get('/api/grades', async (req, res) => {
        return res.status(200).json(await getUserGradesFromToken(apiAuthClient,
            oauthClient, req.headers['authorization'].split(' ')[1]));
    });

    // Responds with the user's profile picture extracted from their token
    app.get('/api/profilepicture', async (req, res) => {
        return res.status(200).json(await getProfilePictureFromIdToken(oauthClient,
            req.headers['authorization'].split(' ')[1]));
    });

    app.listen(PORT, HOSTNAME, () => {
        console.log(`Server is running on port ${PORT}.`);
        console.log('Press Ctrl+C to quit.');
    });
}

// Run the main function if this is a main module
if(esMain(import.meta)){
    main();
}
