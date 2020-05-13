"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This is the id of the video you want to use.
// It should be from your channel or a channel you are authorised to manage.
exports.VIDEO_ID = '<VIDEO_ID>';
// All the options below are optional if you are confused leave them as they are.
// ========================================           
// |       Entity      |   ENTITY_CODE    |
// |-------------------|------------------|
// |   View Count      |     <VIEW>       |
// |   Like Count      |     <LIKE>       |
// |   Dislike Count   |     <DISLIKE>    |
// |   Favorite Count  |    <FAVORITE>    |
// |   Comment Count   |     <COMMENT>    |
// ======================================== 
// If you want to change the title set CHANGE to true else set it to false.
// Edit the value attribute to configure this option.
// The video title will be updated to the format where all entity code is replaced
// with it's value
// For all entity code refer to the table above
exports.TITLE = {
    CHANGE: true,
    VALUE: 'This video has <VIEW> views and <LIKE> likes'
};
// If you want to change the description set CHANGE to true else set it to false.
// Edit the value attribute to configure this option.
// The video description will be updated to the format where all entity code is replaced
// with it's value
// For all entity code refer to the table above
exports.DESCRIPTION = {
    CHANGE: false,
    VALUE: ''
};
function fromatValue(value, statistics) {
    return value.split('<VIEW>').join(statistics.viewCount || '')
        .split('<LIKE>').join(statistics.likeCount || '')
        .split('<DISLIKE>').join(statistics.dislikeCount || '')
        .split('<FAVORITE>').join(statistics.favoriteCount || '')
        .split('<COMMENT>').join(statistics.commentCount || '');
}
exports.fromatValue = fromatValue;
;
exports.ERRORS = {
    NO_ITEMS: new Error('could not get details. response.data dose not contain items.'),
    No_STATISTICS: new Error('could not get details. response.data.items[0] dose not contain statistics.'),
    NO_SNIPPET: new Error('could not get details. response.data.items[0] dose not contain snippet.'),
    NO_CHANGE: new Error('Atleast one amoung title or discription must be changed'),
    GENERAL_ERROR: new Error('Something went wrong. Check log for more information.')
};
//# sourceMappingURL=constants.js.map