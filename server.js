const bodyParser = require('body-parser'); //Used for parsing request bodies
const cors = require('cors');              //Used for enabling CORS requests
const express = require('express');        //Used for creating the server
const port = 8000;                         //Port number for accesssing the webpage
const projectData = {journalEntries: []};  //Object that serves as the server endpoint

/* Create an application instance and set the middleware. */
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

/* Point the application instance to the folder containing the webpage files. */
app.use(express.static('website'));

/* Start the local server. */
const server = app.listen(port, function() {
  console.log(`Weather Journal Application is running on http://localhost:8000`);
});

/* GET route for returning the project data */
app.get('/projectData', function(req, res) {
  res.status(200);
  res.json(projectData);
});

/* POST route for storing data */
app.post('/projectData', function(req, res) {
  let journalEntry = {
    temperature: req.body.temperature,
    date: req.body.date,
    userResponse: req.body.userResponse
  };
  projectData.journalEntries.push(journalEntry);
  res.status(200);
  res.json({message: 'Entry Added'});
});
