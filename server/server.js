import express, { json } from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import esMain from 'es-main';
import config from 'config';

class AuthenticationError extends Error{}
class UnauthorizedAccessError extends Error{}

const app = express();
app.use(cors());
app.use(json());

// Update below constants for individual implementation
// Get keyfile and oauthclientid from google cloud project with an oauth2 client and a service account
// For keyfile, add a key under the service account and add the json keyfile to the auth folder
const HOSTNAME = config.get('server.host');
const PORT = config.get('server.port');
const SPREADSHEETID = config.get('spreadsheet.id'); // In spreadsheet URL
const KEYFILE = config.get('googleconfig.service_account.keyfile');
const SCOPES = config.get('spreadsheet.scopes'); // Keep the same for readOnly
const OAUTHCLIENTID = config.get('googleconfig.oauth.clientid');
const ADMINS = config.get('admins');
const STARTGRADECOLNAME = config.get('spreadsheet.startgradecol'); // Starting column of the spreadsheet where grade data should be read
const ENDGRADECOLNAME = config.get('spreadsheet.endgradecol') // Ending column of the spreadsheet where grade data should be read
const GRADINGPAGENAME = config.get('spreadsheet.gradepage'); // The page in the spreadsheet that the grades are on
const BINSPAGE = config.get('spreadsheet.binpage'); // The page in the spreadsheet that the bin are on
const STARTBIN = config.get('spreadsheet.startbin'); // The cell that the bin start on
const ENDBIN = config.get('spreadsheet.endbin'); // The cell that the bin end on

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

/**
 * Gets the current user's profile picture.
 * @param {OAuth2Client} oauthClient 
 * @param {String} token 
 * @returns url of current user profile picture
 */
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
    if(ADMINS.includes(email)){
        return 2;
    }
    const sheets = google.sheets({version: 'v4', auth: apiAuthClient});
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range: `${GRADINGPAGENAME}!B2:B`
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
        range: `${GRADINGPAGENAME}!${STARTGRADECOLNAME}1:${ENDGRADECOLNAME}1` 
    });
    let assignmentsRows = assignmentsRes.data.values;

    const gradesRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range: `${GRADINGPAGENAME}!${STARTGRADECOLNAME}${userRow}:${ENDGRADECOLNAME}${userRow}`
    });
    let gradesRows = gradesRes.data.values;

    // Updates values to empty lists of lists in case there are no entries
    if(!assignmentsRows){
        assignmentsRows = [[]];
    }
    if(!gradesRows){
        gradesRows = [[]];
    }

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

/**
 * Checks to see if the current user is an admin.
 * @param {OAuth2Client} oauthClient 
 * @param {token} token 
 * @returns whether or not the current user is an admin
 */
async function hasAdminStatus(oauthClient, token){
    const ticket = await oauthClient.verifyIdToken({
        idToken: token,
        audience: OAUTHCLIENTID
    });
    const payload = ticket.getPayload();
    return (ADMINS.includes(payload.email));
}

/**
 * Admin access checking function for middleware.
 * @param {OAuth2Client} oauthClient 
 * @param {String} token 
 */
async function confirmAdminAccount(oauthClient, token){
    try {
        const ticket = await oauthClient.verifyIdToken({
            idToken: token,
            audience: OAUTHCLIENTID
        });
        const payload = ticket.getPayload();
        if (payload['hd'] != 'berkeley.edu') {
            throw new AuthenticationError('domain mismatch');
        }
        if(!(ADMINS.includes(payload.email))){
            throw new UnauthorizedAccessError('User is not an admin.');
        }
    } catch (err) {
        if(typeof err == UnauthorizedAccessError){
            throw err;
        }
        throw new AuthenticationError('Could not authenticate authorization token.');
    }
}

/**
 * Gets a list of all of the students in the class.
 * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
 * @returns list of lists with the first value of legal name and second of email
 */
async function getStudents(apiAuthClient) {
    const sheets = google.sheets({ version: 'v4', auth: apiAuthClient });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range: `${GRADINGPAGENAME}!A2:B`
    });
    return res.data.values;
}

/**
 * Gets the buckets for the current class.
 * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
 * @returns list of lists with the first value being the low end bucket val and the second being the grade
 */
async function getBins(apiAuthClient){
    const sheets = google.sheets({ version: 'v4', auth: apiAuthClient });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range: `${BINSPAGE}!${STARTBIN}:${ENDBIN}`
    });
    return res.data.values;
}

async function main(){
    const apiAuthClient = await new google.auth.GoogleAuth({
        keyFile: KEYFILE,
        scopes: SCOPES
    }).getClient();
    const oauthClient = new OAuth2Client(OAUTHCLIENTID);

    /**
     * Use to exclude a route from being verified with middleware.
     * @param {String} path 
     * @param {Function} middleware 
     * @returns Function
     */
    function unless(path, middleware){
        return function(req, res, next){
            if(path === req.path){
                return next();
            } else {
                return middleware(req, res, next);
            }
        }
    }

    /**
     * Middleware for verifying user acceses.
     * @param {any} req 
     * @param {any} res 
     * @param {any} next 
     * @returns a response message for an error if there is one
     */
    async function verificationMiddleWare(req, res, next){
        let auth = req.headers['authorization'];
        if(!auth){
            return res.status(401).json({error: 'No Authorization provided.'});
        }
        auth = auth.split(' ');
        // Make sure the user's email is in the google sheet
        try{
            await getUserRow(apiAuthClient, await getEmailFromIdToken(oauthClient, auth[1]));
        } catch (e){
            if(e instanceof AuthenticationError){
                return res.status(401).json({ error: 'User not authorized.' });
            }
            return res.status(400).json({ error: 'Unknown error.' });
        }
        next();
    }

    /**
     * Middleware for verifying admin access.
     * @param {any} req 
     * @param {any} res 
     * @param {any} next 
     * @returns a response message for an error if there is one
     */
    async function adminVerificationMiddleWare(req, res, next){
        let auth = req.headers.authorization;
        if (!auth) {
            return res.status(401).json({ error: 'No Authorization provided.' });
        }
        auth = auth.split(' ');
        try{
            await confirmAdminAccount(oauthClient, auth[1]);
        } catch (e) {
            if(e instanceof AuthenticationError){
                return res.status(401).json({ error: 'User not authorized.' });
            }
            if(e instanceof UnauthorizedAccessError){
                return res.status(403).json({ error: 'User does not have access.' });
            }
            return res.status(400).json({ error: 'Unknown error.' });
        }
        next();
    }

    // Initialize middleware
    app.use(unless('/api/bins', verificationMiddleWare));
    app.use('/api/admin', adminVerificationMiddleWare);

    app.get('/api/bins', async (req, res) => {
        return res.status(200).json(await getBins(apiAuthClient));
    });

    // Use the auth checking of middleware to verify proper auth
    app.get('/api/verifyaccess', (req, res) => {
        return res.status(200).send(true);
    });

    // Responds with json dictionary caller's grade data
    app.get('/api/grades', async (req, res) => {
        return res.status(200).json(await getUserGradesFromToken(apiAuthClient,
            oauthClient, req.headers.authorization.split(' ')[1]));
    });

    // Responds with the user's profile picture extracted from their token
    app.get('/api/profilepicture', async (req, res) => {
        return res.status(200).json(await getProfilePictureFromIdToken(oauthClient,
            req.headers.authorization.split(' ')[1]));
    });

    // Responds with whether or not the current user is an admin
    app.get('/api/isadmin', async (req, res) => {
        return res.status(200).json(await hasAdminStatus(oauthClient,
            req.headers.authorization.split(' ')[1]));
    });

    // Responds with the current students in the spreadsheet
    app.get('/api/admin/students', async (req, res) => {
        return res.status(200).json(await getStudents(apiAuthClient));
    });

    // Responds with the grades for the specified student
    app.post('/api/admin/getStudent', async (req, res) => {
        res.status(200).json(await getUserGrades(apiAuthClient, req.body.email));
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
