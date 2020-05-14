"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const googleapis_1 = require("googleapis");
const constants_1 = require("./constants");
const login_1 = require("./login");
const EXTRA_VIDEO_ID = '<E_VIDEO_ID>';
const EXTRA_INFO = `This video's title is managed by Lazy Youtube API \\n
                Check out https://www.youtube.com/watch?v=${EXTRA_VIDEO_ID}to know more. \\n`;
/**
 * Gets the statistics of the video with video id VIDEO_ID
 *
 * @param {OAuth2Client} auth An authorized OAuth2 client.
 * @returns {Promise<VideoInfo>} The details about the video.
 * @throws {NO_RESPONSE,NO_DATA,NO_ITEMS,NO_ITEMS_ARRAY,NO_STATISTICS,NO_SNIPPET}
 */
async function getDetails(auth) {
    const service = googleapis_1.google.youtube('v3');
    const response = await service.videos.list({
        auth: auth,
        id: constants_1.VIDEO_ID,
        part: 'statistics,snippet'
    });
    if (!response)
        throw constants_1.ERRORS.NO_RESPONSE;
    if (!response.data)
        throw constants_1.ERRORS.NO_DATA;
    if (!response.data.items)
        throw constants_1.ERRORS.NO_ITEMS;
    if (!response.data.items[0])
        throw constants_1.ERRORS.NO_ITEMS_ARRAY;
    if (!response.data.items[0].statistics)
        throw constants_1.ERRORS.NO_STATISTICS;
    if (!response.data.items[0].snippet)
        throw constants_1.ERRORS.NO_SNIPPET;
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
async function setDetails(auth, Snippet) {
    const service = googleapis_1.google.youtube('v3');
    return service.videos.update({
        auth: auth,
        part: 'snippet',
        requestBody: {
            id: constants_1.VIDEO_ID,
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
function getSnippet(details) {
    const snippet = {
        categoryId: '27',
        defaultLanguage: 'en'
    };
    const statistics = details.statistics;
    const desc = details.snippet.description;
    if (constants_1.TITLE.CHANGE)
        snippet.title = constants_1.fromatValue(constants_1.TITLE.VALUE, statistics);
    if (constants_1.DESCRIPTION.CHANGE)
        snippet.description = EXTRA_INFO + constants_1.fromatValue(constants_1.DESCRIPTION.VALUE, statistics);
    else
        snippet.description = EXTRA_INFO + desc;
    if (!constants_1.TITLE.CHANGE && !constants_1.DESCRIPTION.CHANGE)
        throw constants_1.ERRORS.NO_CHANGE;
    return snippet;
}
exports.updateVideo = functions.https.onRequest((_request, response) => {
    let auth;
    login_1.login().then((aut) => auth = aut)
        .then((_) => getDetails(auth))
        .then(getSnippet)
        .then((Snippet) => setDetails(auth, Snippet))
        .then((_) => response.end('Mission Success'))
        .catch((error) => {
        console.error(error);
        response.status(404)
            .send(constants_1.ERRORS.GENERAL_ERROR.message);
    });
});
//# sourceMappingURL=index.js.map