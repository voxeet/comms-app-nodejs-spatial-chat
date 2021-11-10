# Blog - Enable Spatial Audio in your web applications

This GitHub repo contains the source code of the sample application presented in the blog post related to Spatial Audio.

## Content of the repository

Two folders are available, `original` for the base sample application that is used in the blog post and `final` that contains the source code of the sample application after adding the code for Spatial Audio.

The sample application contains the following files:
- *index.html* - web page that you need to use to display the application.
- *styles.css* - some simple styles for the application.
- *actions.js* - JavaScript used for the actions likes turning on and off the camera or muting and unmuting the microphone.
- *videos.js* - JavaScript that contains the event handlers for the video streams.
- *utils.js* - JavaScript that contains some utility functions
- *server.js* - Node.JS application that will start a small web server to deliver the web application locally.

## Run the application

You first must install the package dependencies by running the command:

```bash
npm install
```

Create a file called `.env` in your application folder and set the consumer key and secret that you got from your dolby.io dashboard.

```
CONSUMER_KEY=<YOUR_CONSUMER_KEY_HERE>
CONSUMER_SECRET=<YOUR_CONSUMER_SECRET_HERE>
```

Run the web server using the `npm` command:

```bash
npm run start
```

Then you can access the application at http://localhost:8081

## Open Source Projects

This sample application is using the following Open Source projects:
- [Bootstrap](https://getbootstrap.com)
- [JsRender](https://www.jsviews.com/)
- [JQuery](https://jquery.com)
- [Express](https://expressjs.com/)

## Avatar images

The avatar images are made by [photo3idea_studio](https://www.flaticon.com/authors/photo3idea-studio) and [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/).
