import express, { json } from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import esMain from 'es-main';
import config from 'config';
import dotenv from 'dotenv';

class AuthenticationError extends Error{}
class UnauthorizedAccessError extends Error{}
class BadSheetDataError extends Error{}

dotenv.config(); // Load environment variables from .env file
const PORT = process.env.PORT || config.get('server.port');
const SPREADSHEETID = config.get('spreadsheet.id'); // In spreadsheet URL
const SCOPES = config.get('spreadsheet.scopes'); // Keep the same for readOnly
const OAUTHCLIENTID = config.get('googleconfig.oauth.clientid');
const ADMINS = config.get('admins');
const GRADINGPAGENAME = config.get('spreadsheet.pages.gradepage.pagename'); // The page in the spreadsheet that the grades are on
const ASSIGNMENTTYPEROW = config.get('spreadsheet.pages.gradepage.assignmentMetaRow'); // The row with the assignment type
const MAXGRADEROW = config.get('spreadsheet.pages.gradepage.assignmentMetaRow') + 1; // The row with the total amount of points possible for the assignment
const STARTGRADEROW = +config.get('spreadsheet.pages.gradepage.startrow'); // The row that the student grade data starts on
const STARTGRADECOLNAME = config.get('spreadsheet.pages.gradepage.startcol'); // Starting column of the spreadsheet where grade data should be read
const BINSPAGE = config.get('spreadsheet.pages.binpage.pagename'); // The page in the spreadsheet that the bin are on
const STARTBIN = config.get('spreadsheet.pages.binpage.startcell'); // The cell that the bin start on
const ENDBIN = config.get('spreadsheet.pages.binpage.endcell'); // The cell that the bin end on

/**
 * Verifies token and gets the associated email.
 * @param {OAuth2Client} oauthClient 
 * @param {String} token 
 * @returns {Promise<String>} user's email
 * @throws {AuthenticationError} if token is invalid
 */
async function getEmailFromIdToken(oauthClient, token){
    try {
        const ticket = await oauthClient.verifyIdToken({
            idToken: token,
            audience: OAUTHCLIENTID
        });
        const payload = ticket.getPayload();
        if(payload['hd'] !== 'berkeley.edu'){
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
 * @returns {String} url of current user profile picture
 * @throws {AuthenticationError} if token is invalid
 */
async function getProfilePictureFromIdToken(oauthClient, token){
    try {
        const ticket = await oauthClient.verifyIdToken({
            idToken: token,
            audience: OAUTHCLIENTID
        });
        const payload = ticket.getPayload();
        if (payload['hd'] !== 'berkeley.edu') {
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
    if(email === MAXGRADEROW){
        return MAXGRADEROW;
    }
    if(ADMINS.includes(email)){
        return STARTGRADEROW;
    }
    const sheets = google.sheets({version: 'v4', auth: apiAuthClient});
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range: `${GRADINGPAGENAME}!B${STARTGRADEROW}:B`
    });
    const rows = res.data.values;

    for(let i = 0; i < rows.length; i++){
        if(rows[i][0] === email){
            return STARTGRADEROW + i;
        }
    }
    throw new AuthenticationError('No user with token email found.');
}

/**
 * Gets the user's grades associated with the provided email.
 * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
 * @param {String} email 
 * @returns {Promise<Object>} dictionary of user's grades
 * @throws {AuthenticationError} if user is not found
 */
async function getUserGrades(apiAuthClient, email){
    const userRow = await getUserRow(apiAuthClient, email);
    const sheets = google.sheets({version: 'v4', auth: apiAuthClient});

    const assignmentMetaRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range: `${GRADINGPAGENAME}!${STARTGRADECOLNAME}1:${ASSIGNMENTTYPEROW}`
    });
    let assignmentMeta = assignmentMetaRes.data.values;

    const gradesRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEETID,
        range: `${GRADINGPAGENAME}!${STARTGRADECOLNAME}${userRow}:${userRow}`
    });
    let gradesRows = gradesRes.data.values;

    // Updates values to empty lists of lists in case there are no entries
    if(!assignmentMeta){
        assignmentMeta = [[]];
    }
    if(!gradesRows){
        gradesRows = [[]];
    }

    let assignments = []
    // Populate assignments dictionary with grades
    for(let i = 0; i < assignmentMeta[0].length; i++){
        assignments.push({
            id: i,
            assignment: assignmentMeta[0][i],
            grade: gradesRows[0][i],
            type: assignmentMeta[ASSIGNMENTTYPEROW - 1][i]
        });
    }
    return assignments;
}

/**
 * Get the user's grades using the user's token.
 * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
 * @param {OAuth2Client} oauthClient 
 * @param {String} token 
 * @returns {Promise<Object>} of user's grades
 */
async function getUserGradesFromToken(apiAuthClient, oauthClient, token){
    return await getUserGrades(apiAuthClient, await getEmailFromIdToken(oauthClient, token));
}

/**
 * Gets the user's grades with fractional component associated with the provided email.
 * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
 * @param {String} email 
 * @returns {Promise<Object>} dictionary of user's grades
 */
async function getUserGradesAsFraction(apiAuthClient, email){
    const userGrades = await getUserGrades(apiAuthClient, email);
    const gradeMeta = await getUserGrades(apiAuthClient, MAXGRADEROW);
    gradeMeta.map((assignment) => {
        if (!assignment.grade){
            return assignment.assignment = null;
        }
        return assignment.grade = {studentGrade: userGrades[assignment.id]?.grade, maxGrade: assignment.grade}
    });
    return gradeMeta.filter((assignment) => assignment.assignment);
}

/**
 * Gets the user's grades with fractional component from the user's token.
 * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
 * @param {String} oauthClient 
 * @param {String} token 
 * @returns {Promise<Object>} dictionary of user's grades
 */
async function getUserGradesFromTokenAsFraction(apiAuthClient, oauthClient, token){
    return await getUserGradesAsFraction(apiAuthClient, await getEmailFromIdToken(oauthClient, token));
}

/**
 * Get the total amount of points the user had achieved so far.
 * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
 * @param {String} email 
 * @returns {Promise<boolean>} user's total points
 */
async function getUserPoints(apiAuthClient, email){
    const userPointData = await getUserGrades(apiAuthClient, email);
    let points = 0;
    userPointData.forEach((assignment) => {
        const grade = assignment.grade;
        if(grade != null){
            points += +grade;
        }
    });
    if(isNaN(points)){
        throw new BadSheetDataError(`Unable to parse ${email} row data.`);
    }
    return points;
}

/**
 * Use present data to project how the user will preform going forward using email.
 * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
 * @param {String} email 
 * @returns {Promise<Object>} projections for users grades
 */
async function getProjectedGrades(apiAuthClient, email){
    let projections = { 'zeros': null, 'pace': null, 'perfect': null };
    const bins = await getBins(apiAuthClient);
    const maxPoints = +bins[bins.length - 1][0];
    const maxPointsSoFar = +await getUserPoints(apiAuthClient, MAXGRADEROW);
    const userPointsSoFar = +await getUserPoints(apiAuthClient, email);
    projections.zeros = Math.round(userPointsSoFar);
    projections.pace = Math.round((userPointsSoFar / maxPointsSoFar) * maxPoints);
    projections.perfect = Math.round(userPointsSoFar + (maxPoints - maxPointsSoFar));
    return projections;
}

/**
 * Use present data to project how the user will preform going forward using token.
 * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
 * @param {OAuth2Client} oauthClient 
 * @param {String} token 
 * @returns {Promise<Object>} projections for users grades
 */
async function getProjectedGradesFromToken(apiAuthClient, oauthClient, token){
    return await getProjectedGrades(apiAuthClient, await getEmailFromIdToken(oauthClient, token));
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
        if (payload['hd'] !== 'berkeley.edu') {
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
        range: `${GRADINGPAGENAME}!A${STARTGRADEROW}:B`
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
    const app = express();
    app.use(cors());
    app.use(json());

    const apiAuthClient = await new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.SERVICE_ACCOUNT_CREDENTIALS),
        scopes: SCOPES
    }).getClient();
    const oauthClient = new OAuth2Client(OAUTHCLIENTID);

    /**
     * Use to exclude a route from being verified with middleware.
     * @param {String} path 
     * @param {Function} middleware 
     * @returns Function
     */
    function unless(paths, middleware){
        return function(req, res, next){
            if(paths.includes(req.path)){
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
    app.use(unless(['/api/bins', '/api/verifyaccess'], verificationMiddleWare));
    app.use('/api/admin', adminVerificationMiddleWare);

    /** 
     * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
     * @returns list of lists with the first value being the low end bucket val and the second being the grade
    */

    app.get('/api/bins', async (req, res) => {
        return res.status(200).json(await getBins(apiAuthClient));
    });

    /**
     * @param {OAuth2Client} oauthClient 
     * @param {String} token 
     * @returns {Promise<String>} user's email 
    */
    app.get('/api/verifyaccess', async (req, res) => {
        let auth = req.headers['authorization'];
        if (!auth) {
            return res.status(401).send(false);
        }
        auth = auth.split(' ');
        try {
            await getUserRow(apiAuthClient, await getEmailFromIdToken(oauthClient, auth[1]));
            return res.status(200).send(true);
        } catch (e) {
            console.log(e);
            return res.status(401).send(false);
        }
    });

    // Responds with json dictionary caller's grade data
    /**
     * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
     * @param {String} oauthClient 
     * @param {String} token 
     * @returns {Promise<Object>} dictionary of user's grades
     */
    app.get('/api/grades', async (req, res) => {
        return res.status(200).json(await getUserGradesFromTokenAsFraction(apiAuthClient,
            oauthClient, req.headers.authorization.split(' ')[1]));
    });

    // Responds with the user's profile picture extracted from their token
    /**
     * @param {OAuth2Client} oauthClient 
     * @param {String} token 
     * @returns {String} url of current user profile picture
     */
    app.get('/api/profilepicture', async (req, res) => {
        return res.status(200).json(await getProfilePictureFromIdToken(oauthClient,
            req.headers.authorization.split(' ')[1]));
    });

    /**
     * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
     * @param {OAuth2Client} oauthClient 
     * @param {String} token 
     * @returns {Promise<Object>} projections for users grades
     */
    app.get('/api/projections', async (req, res) => {
        try{
            return res.status(200).json(await getProjectedGradesFromToken(apiAuthClient,
                oauthClient, req.headers.authorization.split(' ')[1]));
        } catch (e) {
            if(e instanceof BadSheetDataError){
                console.log(e);
                return res.status(502).json({ error: '502: Bad Gateway'});
            }
        }
    });

    // Responds with whether or not the current user is an admin
    /**
     * @param {OAuth2Client} oauthClient 
     * @param {token} token 
     * @returns whether or not the current user is an admin
     */
    app.get('/api/isadmin', async (req, res) => {
        return res.status(200).json(await hasAdminStatus(oauthClient,
            req.headers.authorization.split(' ')[1]));
    });

    // Responds with the current students in the spreadsheet
    /**
     * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
     * @returns list of lists with the first value of legal name and second of email
     */
    app.get('/api/admin/students', async (req, res) => {
        return res.status(200).json(await getStudents(apiAuthClient));
    });

    // Responds with the grades for the specified student
    /**
     * @param {Promise<Compute | JSONClient | T>} apiAuthClient 
     * @param {String} email 
     * @returns {Promise<Object>} dictionary of user's grades
     */
    app.post('/api/admin/getStudent', async (req, res) => {
        res.status(200).json(await getUserGradesAsFraction(apiAuthClient, req.body.email));
    });

    //app listens on PORT
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
        console.log('Press Ctrl+C to quit.');
    });
}

// Run the main function if this is a main module
if(esMain(import.meta)){
    main();
}
