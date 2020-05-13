import * as readline from 'readline';
import { google } from 'googleapis';
import * as fs from 'fs';
import { CredentialsJSON } from './constants';
import { OAuth2Client } from '../node_modules/googleapis-common/node_modules/google-auth-library/build/src/auth/oauth2client'
export { OAuth2Client }

// If modifying these scopes, delete your previously saved credentials
// at functions/lib/.credentials/credentials.json
const SCOPES = ['https://www.googleapis.com/auth/youtube'];
const CRED_DIR = __dirname + '/.credentials/';
const TOKEN_PATH = CRED_DIR + 'youtube-data-v3.json';
const JSON_PATH = CRED_DIR + 'credentials.json'

/**
 * Helper function to read JSON file
 * 
 * @param {String} path The path to JSON file.
 * @returns {Promise<JSON>}
 */
function readJSON(filePath: string): Promise<CredentialsJSON> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (error, buffer) => {
            if (error) reject(error);
            else resolve(JSON.parse(buffer.toString()));
        })
    });
}

/**
 * Create an OAuth2 client with the credentials from json, and then return a 
 * promise which resolves to OAuth2 object
 * 
 * @returns {OAuth2Client}
 */
export async function login(): Promise<OAuth2Client> {
    // Load client secrets from a local file.
    const credentials = await readJSON(JSON_PATH)
    if(!credentials.installed) 
        throw new Error(`Unable to read credentials. Make sure ${JSON_PATH} exists`)
        
    // Authorize a client with the loaded credentials, then call the YouTube API.
    const clientSecret = credentials.installed.client_secret;
    const clientId = credentials.installed.client_id;
    const redirectUrl = credentials.installed.redirect_uris[0];
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
    try {
        //Check if we have token saved.
        const token = await readJSON(TOKEN_PATH)
        //Found saved token so use it.
        oauth2Client.credentials = token;
        return oauth2Client;
    } catch (error) {
        //No saved token found so get a new one.
        return getNewToken(oauth2Client);
    }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * return a promise which resolves to OAuth2 object
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @returns {Promise<google.auth.OAuth2>}
 */
function getNewToken(oauth2Client: any): Promise<any> {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve, reject) =>
        rl.question('Enter the code from that page here: ', (code: any) => {
            rl.close();
            oauth2Client.getToken(code, (err: any, token: any) => {
                if (err) reject(err)
                else {
                    oauth2Client.credentials = token;
                    //Store token to disk be used in later program executions.
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (error: any) => {
                        if (error) reject(error);
                        else {
                            console.log('Token stored to ' + TOKEN_PATH);
                            resolve(oauth2Client);
                        }
                    });
                }
            });
        }));
}

login().then(console.log).catch(console.error);