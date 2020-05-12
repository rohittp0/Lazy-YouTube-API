"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const googleapis_1 = require("googleapis");
const constants_1 = require("./constants");
const login_1 = require("./login");
/**
 * Gets the statistics of the video with video id VIDEO_ID
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function getDetails(auth) {
    const service = googleapis_1.google.youtube('v3');
    const response = await service.videos.list({
        auth: auth,
        id: constants_1.VIDEO_ID,
        part: 'statistics'
    });
    if (response.data.items)
        return response.data.items[0].statistics;
    else
        throw new Error("could not get view count");
}
/**
 * Gets the statistics of the video with video id VIDEO_ID
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @returns {Promise<any>} serevrResponse
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
    });
}
/**
 * Creates a snippet object to be used to update the video.
 *
 * @param {object} statistics The statistics object to get values from.
 * @returns {snippet} serevrResponse
 */
function getSnippet(statistics) {
    const Snippet = {
        categoryId: 27,
        defaultLanguage: 'en'
    };
    if (constants_1.TITLE.CHANGE)
        Snippet.title = constants_1.fromatValue(constants_1.TITLE.VALUE, statistics);
    if (constants_1.DESCRIPTION.CHANGE)
        Snippet.description = constants_1.fromatValue(constants_1.DESCRIPTION.VALUE, statistics);
    if (!constants_1.TITLE.CHANGE && !constants_1.DESCRIPTION.CHANGE)
        throw new Error("Atleast one amoung title and discription must be changed");
    return Snippet;
}
exports.updateVideo = functions.https.onRequest((request, response) => {
    let auth;
    login_1.login().then((aut) => auth = aut)
        .then((_) => getDetails(auth))
        .then(getSnippet)
        .then((Snippet) => setDetails(auth, Snippet))
        .then((res) => response.end("Mission Success"))
        .catch((error) => {
        console.error(error);
        response.status(404)
            .send('Something went wrong. Check log for more information.');
    });
});
//# sourceMappingURL=index.js.map