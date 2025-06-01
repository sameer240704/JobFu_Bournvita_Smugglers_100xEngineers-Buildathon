import dotenv from 'dotenv';
dotenv.config();

import { google } from 'googleapis';
import readline from 'readline';

const CLIENT_ID = 'your-client-id';
const CLIENT_SECRET = 'your-client-secret';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose'
];

const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
});

console.log('Authorize this app by visiting this url:', authUrl);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Enter the code from that page here: ', async (code) => {
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        console.log('Your refresh token:', tokens.refresh_token);
    } catch (error) {
        console.error('Error getting tokens:', error);
    }
    rl.close();
});