![](https://dolby.io/wp-content/uploads/2021/11/spatial-app-layout-2048x1161.png)
# Enable Spatial Audio in your web applications

##Overview
At Dolby.io, we aim to deliver the best experience for your real-time communication needs. We have introduced the Spatial Audio capability in the Dolby.io Communications APIs as the most recent step to make your end user’s experience better. This allows you to place conference participants in a 3D rendered audio scene and hear the participants from the given locations.

This GitHub repo contains the source code of the sample application presented in [this guide to enabling spatial audio in you web applications](https://dolby.io/blog/enabling-spatial-audio-in-your-web-applications/).

## Requirements
- [npm](https://www.npmjs.com/) installed on your machine.
- A [Dolby.io Account](https://dashboard.dolby.io/signup).
- A code editor.
- A Microphone connected up to your test device.

## Content of the repository

Two folders are available, `original` for the base sample application that is used in the blog post and `final` that contains the source code of the sample application after adding the code for Spatial Audio.

The sample application contains the following files:
- *index.html* - web page that you need to use to display the application.
- *styles.css* - some simple styles for the application.
- *actions.js* - JavaScript used for the actions likes turning on and off the camera or muting and unmuting the microphone.
- *videos.js* - JavaScript that contains the event handlers for the video streams.
- *utils.js* - JavaScript that contains some utility functions
- *server.js* - Node.JS application that will start a small web server to deliver the web application locally.

## Getting Started

You first must install the package dependencies by running the command:

```bash
npm install
```

Create a file called `.env` in your application folder and set the application key and secret that you got from your dolby.io dashboard.

```
APP_KEY=<YOUR_APP_KEY_HERE>
APP_SECRET=<YOUR_APP_SECRET_HERE>
```

Run the web server using the `npm` command:

```bash
npm run start
```

Then you can access the application at http://localhost:8081

## Report a Bug 
In the case any bugs occur, report it using Github issues, and we will see to it. 

## Forking
We welcome your interest in trying to experiment with our repos.

## Feedback 
If there are any suggestions or if you would like to deliver any positive notes, feel free to open an issue and let us know!

## Learn More
- [Introduction to Dolby.io Communications](https://docs.dolby.io/communications-apis/docs/overview-introduction)
- [Dolby.io Spatial Chat](https://docs.dolby.io/communications-apis/docs/guides-spatial-chat)
- [Integrating Shared Spatial Chat](https://docs.dolby.io/communications-apis/docs/guides-integrating-shared-spatial-chat)

**Open Source Projects**

This sample application is using the following Open Source projects:
- [Bootstrap](https://getbootstrap.com)
- [JsRender](https://www.jsviews.com/)
- [JQuery](https://jquery.com)
- [Express](https://expressjs.com/)

**Avatar images**

The avatar images are made by [photo3idea_studio](https://www.flaticon.com/authors/photo3idea-studio) and [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/).

## About Dolby.io

Using decades of Dolby's research in sight and sound technology, Dolby.io provides APIs to integrate real-time streaming, voice & video communications, and file-based media processing into your applications. [Sign up for a free account](https://dashboard.dolby.io/signup/) to get started building the next generation of immersive, interactive, and social apps.

<div align="center">
  <a href="https://dolby.io/" target="_blank"><img src="https://img.shields.io/badge/Dolby.io-0A0A0A?style=for-the-badge&logo=dolby&logoColor=white"/></a>
&nbsp; &nbsp; &nbsp;
  <a href="https://docs.dolby.io/" target="_blank"><img src="https://img.shields.io/badge/Dolby.io-Docs-0A0A0A?style=for-the-badge&logoColor=white"/></a>
&nbsp; &nbsp; &nbsp;
  <a href="https://dolby.io/blog/category/developer/" target="_blank"><img src="https://img.shields.io/badge/Dolby.io-Blog-0A0A0A?style=for-the-badge&logoColor=white"/></a>
</div>

<div align="center">
&nbsp; &nbsp; &nbsp;
  <a href="https://youtube.com/@dolbyio" target="_blank"><img src="https://img.shields.io/badge/YouTube-red?style=flat-square&logo=youtube&logoColor=white" alt="Dolby.io on YouTube"/></a>
&nbsp; &nbsp; &nbsp; 
  <a href="https://twitter.com/dolbyio" target="_blank"><img src="https://img.shields.io/badge/Twitter-blue?style=flat-square&logo=twitter&logoColor=white" alt="Dolby.io on Twitter"/></a>
&nbsp; &nbsp; &nbsp;
  <a href="https://www.linkedin.com/company/dolbyio/" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white" alt="Dolby.io on LinkedIn"/></a>
</div>