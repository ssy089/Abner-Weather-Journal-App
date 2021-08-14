# Weather Journal App - Abner Vinaja

## Introduction
This repository contains my code for the third project in [Udacity's Front End Web Developer Nanodegree Program](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd0011). This project creates a basic weather journal application.
This project uses server-side and client-side code to collect, store, and retrieve weather data and user input.
Also, this project uses Promises in JavaScript to perform the following actions:
- Get weather data about specific ZIP codes using the [OpenWeatherMap API](https://openweathermap.org/api).
- Store weather data with user input on the server endpoint.
- Get all data from the server endpoint, and then dynamically update the User Interface (UI) to display the data.

## Project Content
Along with this documentation, the root directory of this project contains the following important files:
- server.js: Server code for the project
- package.json: Used to manage Node.js dependecies and scripts
- package-lock.json: Used to manage changes to the package.json file or to other Node.js dependencies

The "website" folder contains the HTML files, CSS files, application code (client-side code), and images
that are used to build and update the webpage.

## Required Software
This project requires Node.js v14.15.5 or higher.

Note that in order to gather weather data, this project requires an API key for the OpenWeatherMap API.
This key needs to be added to the `apiKey` variable in the [app.js](./website/js/app.js) file of this project.
For example, if your API key is 12345, you set the `apiKey` variable as `const apiKey = '&appid=12345'`.
You can sign up for a free API key at the [OpenWeatherMap API website](https://openweathermap.org/api).

## Installation
If Node.js is not installed, go to [Node.js](https://nodejs.org/en/), download the
appropriate Node.js installation file for your operating system, and install Node.js using the default
installation settings. If you need to update your computer's version of Node.js, see this [article](https://www.whitesourcesoftware.com/free-developer-tools/blog/update-node-js/) for advice.
Once Node.js is installed, run the command `npm install` on your terminal, which will install all the modules
listed as dependencies in the package.json file.

## Execution
To execute the server code for this project, run the command `node server.js` on your terminal.
Then, open your browser and enter the URL, [http://localhost:8000](http://localhost:8000), to open the project webpage.

## Known Issues/Bugs
The current code has no existing technical issues or bugs.

## Copyright and Licensing Information
This project is currently not under any license.

## Acknowledgements
Other than the .gitignore file, all files in this project were developed from scratch. However, the webpage's structure is based off of the
basic webpage structure presented by Udacity's [starter code](https://github.com/udacity/fend/tree/refresh-2019/projects/weather-journal-app) for the project.
