# YouTube-API

<center>!<img src="./Rescources/icon.png" alt="logo"></center>

Haven't you heard about the latest trend in YouTube. **DYNAMIC VIDEO TITLES DESCRIPTIONS !! ** What you did not see the literally two videos that exists out there ? You surely must be living under a rock. Don't worry now you don't even need to know what it is to create one. You can use this script to walk you through and do the majority of the work.

## What is this Dynamic Thing ?

Dynamic titles and descriptions are titles and descriptions that change even after the video is uploaded to YouTube. This means that they can contain information that may change over time. So to say it in non-technical terms just replace the word with automatically updating. You can simply thing of them as changing every few minutes to catch up with some changing data.

## Getting Started

### Using Default Options

If you are planing to use the script with all the options set to default values then you are in luck. You can just click on the button above and run the script directly on Google-Colab. The script is designed to walk you through no more explanation needed. But if for some reason ( Which I actually can’t understand ) are confused watch this video for a step by step instructions :

<center><a href="https://www.youtube.com/watch?v=video_id"><img src="https://yt-embed.herokuapp.com/embed?v=video_id" alt="Click here to watch on YouTube"></a></center> 

### With Custom Options

Lazy YouTube API was designed with combustibility in mind. This means that you can tweak every parameter the script uses. After opening the script on Colab run only the first code block then open `/api/functions/lib/constants.js` . The file is well documented about all settings you can change and how. These are all the available options.

| **ENTITY** | **ENTITY CODE** |
| :--------: | :-------------: |
| View Count |     `<VIEW>`      |
| Like Count | `<LIKE>` |
| Dislike Count | `<DISLIKE>` |
| Favourite Count | `<FAVOURITE>` |
| Comment Count | `<COMMENT>` |



#### Examples

**=> Change title to include comment count along with views and likes**

```javascript
exports.TITLE = {
    CHANGE: true,
    VALUE: 'This video has <VIEW> views and <LIKE> likes and <COMMENT> comments'
};
```

**=> Change The Description to include Dislikes and Favourites**

```javascript
exports.DESCRIPTION = {
    CHANGE: true,
    VALUE: 'This video has <DISLIKE> dislikes :( but it also has <FAVOURITE> favourites :)'
};
```
**=> Disable changing Title**

```javascript
exports.TITLE = {
    CHANGE: false, // Determins weather or not to change title
    VALUE: 'No mater what you put here it will be ignored'
};
```

### Running Locally

This is intended only for those who are comfortable with code, terminal and frustrating nights trying to figure out in which file you made that silly typo. If you still want to run this locally or if you want to tweak the core clone this repository.

```bash
git clone https://github.com/rohittp0/Lazy-YouTube-API.git
```

## How dose it Work ?

This script creates a Firebase cloud function (HTTPS rest API)  that when called will use YouTube’s Data API  to read and update your video title and description. YouTube provides 10 thousand API quota per day. One call from our function costs 56 points so we can safely call the API every 8 minutes. Calling the function at this rate is handled by a cron job of your choice (I recommend [cron-job.org](https://cron-job.org/en/) ) . For more details check out the [documentation](/docs/README.md)

## Questions and Feedback

If you are facing any problem feel free to open an issue or mail me a stack overflow question with `layz-youtube-api` as tag. Any and all pull requests are always welcome.

### Contact Me

**Mail me @** tprohit9@gmail.com

**Catch me on** [Stackoverflow](https://stackoverflow.com/users/10182024/rohi)

**Check out my YouTube** [Channel](https://www.youtube.com/channel/UCVRdZwluF8jYXSIaHBqK73w)

**Follow me on** [Instagram](https://www.instagram.com/rohit_pnr/)