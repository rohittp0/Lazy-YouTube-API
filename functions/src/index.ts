import * as functions from 'firebase-functions';
import { google } from 'googleapis';
import { VIDEO_ID, TITLE, DESCRIPTION, snippet, fromatValue } from './constants';
import { login } from './login';

/**
 * Gets the statistics of the video with video id VIDEO_ID
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function getDetails(auth: any) {
    const service = google.youtube('v3');

    const response = await service.videos.list({
        auth: auth,
        id: VIDEO_ID,
        part: 'statistics'
    });
    if (response.data.items)
        return response.data.items[0].statistics;
    else throw new Error("could not get view count");
}

/**
 * Gets the statistics of the video with video id VIDEO_ID
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @returns {Promise<any>} serevrResponse
 */
async function setDetails(auth: any, Snippet: any): Promise<any> {
    const service = google.youtube('v3');
    return service.videos.update({
        auth: auth,
        part: 'snippet',
        requestBody: {
            id: VIDEO_ID,
            snippet: Snippet
        }
    });
}

/**
 * Creates a snippet object to be used to update the video.
 *
 * @param {object} statistics The statistics object to get values from.
 * @returns {snippet} serevrResponse
 */
function getSnippet(statistics: any): snippet {
    const Snippet: snippet = {
        categoryId: 27,
        defaultLanguage: 'en'
    }
    if (TITLE.CHANGE)
        Snippet.title = fromatValue(TITLE.VALUE, statistics)
    if (DESCRIPTION.CHANGE)
        Snippet.description = fromatValue(DESCRIPTION.VALUE, statistics)
    if (!TITLE.CHANGE && !DESCRIPTION.CHANGE)
        throw new Error("Atleast one amoung title and discription must be changed");
    return Snippet
}

export const updateVideo = functions.https.onRequest((request: any, response) => {
    let auth: any;
    login().then((aut) => auth = aut)
        .then((_) => getDetails(auth))
        .then(getSnippet)
        .then((Snippet) => setDetails(auth, Snippet))
        .then((res) => response.end("Mission Success"))
        .catch((error: any) => {
            console.error(error);
            response.status(404)
                .send('Something went wrong. Check log for more information.');
        });
});