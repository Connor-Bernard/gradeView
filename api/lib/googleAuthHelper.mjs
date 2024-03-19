import config from "config";
import AuthenticationError from "../v2/Errors/AuthenticationError.js";
import {OAuth2Client} from "google-auth-library";

export function hasAuthHeader(token) {

}

export async function getEmailFromAuth(token) {
    try {
        let oauthClient = new OAuth2Client(config.get('googleconfig.oauth.clientid'))
        const ticket = await oauthClient.verifyIdToken({
            idToken: token,
            audience: config.get('googleconfig.oauth.clientid')
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

export function verifyBerkeleyEmail(email) {
    return email.split("@").length === 2
            && email.split("@")[1] === "berkeley.edu";
}

export function ensureStudentOrAdmin(email) {
    return config.get('admins').includes(email)
}
