import * as functions from 'firebase-functions';
import { google, youtube_v3 } from 'googleapis';
import { VIDEO_ID, TITLE, DESCRIPTION, ERRORS, VideoInfo, fromatValue } from './constants';
import { login, OAuth2Client } from './login';

const EXTRA_VIDEO_ID = 'sOfC0rcrCs8'
const EXTRA_INFO = `This video's title is managed by Lazy Youtube API
Check out https://www.youtube.com/watch?v=${EXTRA_VIDEO_ID} to know more.
`

/**
 * Gets the statistics of the video with video id VIDEO_ID
 *
 * @param {OAuth2Client} auth An authorized OAuth2 client.
 * @returns {Promise<VideoInfo>} The details about the video.
 * @throws {NO_RESPONSE,NO_DATA,NO_ITEMS,NO_ITEMS_ARRAY,NO_STATISTICS,NO_SNIPPET}
 */
async function getDetails(auth: OAuth2Client): Promise<VideoInfo> {
    const service = google.youtube('v3');

    const response = await service.videos.list({
        auth: auth,
        id: VIDEO_ID,
        part: 'statistics,snippet'
    });
    if (!response)
        throw ERRORS.NO_RESPONSE;
    if (!response.data)
        throw ERRORS.NO_DATA;
    if (!response.data.items)
        throw ERRORS.NO_ITEMS;
    if (!response.data.items[0])
        throw ERRORS.NO_ITEMS_ARRAY;
    if (!response.data.items[0].statistics)
        throw ERRORS.NO_STATISTICS;
    if (!response.data.items[0].snippet)
        throw ERRORS.NO_SNIPPET;
    return {
        statistics: response.data.items[0].statistics,
        snippet: response.data.items[0].snippet
    };
}

/**
 * Gets the statistics of the video with video id VIDEO_ID
 *
 * @param {OAuth2Client} auth An authorized OAuth2 client.
 * @returns {Promise<youtube_v3.Schema$Video>} serverResponse
 */
async function setDetails(auth: OAuth2Client, Snippet: youtube_v3.Schema$VideoSnippet): Promise<youtube_v3.Schema$Video> {
    const service = google.youtube('v3');
    return service.videos.update({
        auth: auth,
        part: 'snippet',
        requestBody: {
            id: VIDEO_ID,
            snippet: Snippet
        }
    }).then();
}

/**
 * Creates a snippet object to be used to update the video.
 *
 * @param {VideoInfo} details The details about the video.
 * @returns {youtube_v3.Schema$VideoSnippet}
 * @throws {NO_CHANGE}
 */
function getSnippet(details: VideoInfo): youtube_v3.Schema$VideoSnippet {
    const snippet: youtube_v3.Schema$VideoSnippet = {
        categoryId: '27',
        defaultLanguage: 'en'
    };
    const statistics = details.statistics;
    const desc = details.snippet.description;

    if (TITLE.CHANGE)
        snippet.title = fromatValue(TITLE.VALUE, statistics);
    if (DESCRIPTION.CHANGE)
        snippet.description = EXTRA_INFO + fromatValue(DESCRIPTION.VALUE, statistics)
            .split(EXTRA_INFO).join()
    else
        if (desc) snippet.description = EXTRA_INFO + desc.split(EXTRA_INFO).join();
        else snippet.description = EXTRA_INFO;

    if (!TITLE.CHANGE && !DESCRIPTION.CHANGE)
        throw ERRORS.NO_CHANGE;

    return snippet
}

export const updateVideo = functions.https.onRequest((_request, response) => {
    let auth: any;
    login().then((aut) => auth = aut)
        .then((_) => getDetails(auth))
        .then(getSnippet)
        .then((Snippet) => setDetails(auth, Snippet))
        .then((_) => response.end('Mission Success'))
        .catch((error: any) => {
            console.error(error);
            response.status(404)
                .send(ERRORS.GENERAL_ERROR.message);
        });
});