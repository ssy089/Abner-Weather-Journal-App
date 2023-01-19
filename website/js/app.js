const apiKey = '&appid='; //API Key for accessing the OpenWeatherMap API
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip='; //Base URL for the OpenWeatherMap API

/*
 * Purpose: This function verifies the user inputs.
 * This function confirms that the user filled in the form's fields,
 * and then ensures that the data is valid.
 *
 * Parameters:
 * - enteredZIP: This is an Element object that represents the element containing a ZIP code.
 * - eneteredFeelings: This is an Element object that represents the user's text on their current feelings.
 *
 */
function verifyEnteredData(enteredZIP, enteredFeelings) {
  let dataValid = true; //Assume by default that all the data is valid.

  /* Ensure that the provided ZIP code is of the right length. */
  if(enteredZIP.value.length !== 5) {
    enteredZIP.insertAdjacentHTML('afterend', '<p class="error">A five-digit number must be provided for the ZIP Code.</p>');
    dataValid = false;
  }
  /* Ensure that all characters in the provided ZIP code are numbers. */
  else {
    for(let substring of enteredZIP.value) {
      if(isNaN(parseInt(substring, 10))) {
        enteredZIP.insertAdjacentHTML('afterend', '<p class="error">The given ZIP code is not a five-digit number.</p>');
	dataValid = false;
	break;
      }
    }
  }
  /* Ensure that the user provided some input about their feelings. */
  if(enteredFeelings.value.length === 0) {
    enteredFeelings.insertAdjacentHTML('afterend', '<p class="error">Please provide some text describing your current feelings.</p>');
    dataValid = false;
  }
  /* Ensure that the user's input is only up 250 characters (to store minimal data). */
  else if(enteredFeelings.value.length > 250) {
    enteredFeelings.insertAdjacentHTML('afterend', '<p class="error">Describe your feelings in 250 characters or less.</p>');
    dataValid = false;
  }
  return dataValid;
}

/*
 * Purpose: This function retrieves the stored journal entries.
 * This function sends an HTTP GET request to the local server
 * to get all journal entries that are stored for the current session.
 */
async function getJournalData(dataURL) {
  const serverResponse = await fetch(dataURL); //Fetch the data from the local server.

  /* Convert the JSON response to a JavaScript object. */
  try {
    const projectData = await serverResponse.json();
    return projectData;
  }
  catch(error) {
    console.log(`Error: ${error}`);
  }
}

/*
 * Purpose: This function retrieves weather data from
 * the OpenWeatherMap API. The function sends an HTTP
 * GET request using my API key and the ZIP code provided
 * by the user.
 */
async function getZIPCodeWeatherData(zipCode) {
  const apiResponse = await fetch(baseURL + zipCode + apiKey); //Fetch the data from the OpenWeatherMap API.

  /* Convert the JSON response to a Javascript object. */
  try {
    const responseData = await apiResponse.json();
    return responseData;
  }
  catch(error) {
    console.log(`Error: ${error}`);
  }
}

/*
 * Purpose: This function posts data to the local server.
 * This function sends an HTTP POST request to the local server.
 * The request will send a new journal entry to the server.
 */
async function postJournalData(dataURL, journalEntry) {
  /* Send the HTTP POST request. */
  const serverResponse = await fetch(dataURL, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(journalEntry)
  });

  /* Convert the JSON response to a JavaScript object. */
  try {
    const responseData = await serverResponse.json();
    return responseData;
  }
  catch(error) {
    console.log(`Error: ${error}`);
  }
}

/*
 * Purpose: This function dynamically updates the User Interface
 * (UI) when the user submits data for a new journal entry.
 * This function makes use of other asynchronous functions to dynamically
 * collect the user input, get the corresponding weather data, store
 * a new journal entry in the local server, and add the journal
 * entry to the UI.
 */
function generateData(clickEvent) {
  clickEvent.preventDefault(); //Prevent the page from reloading when the submit button is clicked.

  /* Remove any existing error messages from the UI. */
  const errorMessages = document.querySelectorAll('.error');
  for(let errorMessage of errorMessages) {
    errorMessage.remove();
  }

  /* Get the input elements and verify the user input before proceeding. */
  const enteredZIP = document.getElementById('zip');           //Element containing the provided ZIP code
  const enteredFeelings = document.getElementById('feelings'); //Element containing the provided text on feelings.
  const dataValid = verifyEnteredData(enteredZIP, enteredFeelings); //Verify the data.
  if(dataValid === false) {
    return;
  }

  /* Using Promises, chain functions that get weather data, put together
   * the data into a journal entry, post the data to the server and update the UI
   * with the new data.
   */
  getZIPCodeWeatherData(enteredZIP.value).then(function(data) {
    /* Check if the OpenWeatherMap API responded with an error message. */
    const invalidZIPMessage = {cod: '404', message: 'city not found'}; //Object for a 404 response.
    if(data.cod !== 200) {
      /* If the provided ZIP code is syntactically correct but not existent, notify the user. */
      if((data.hasOwnProperty('message') === true) && (data.message === invalidZIPMessage.message)) {
        enteredZIP.insertAdjacentHTML('afterend', '<p class="error">Sorry, the given ZIP Code does not exist.</p>');
      }
      /* Notify the user if some other unexpected error occurred. */
      else {
        enteredZIP.insertAdjacentHTML('afterend', '<p class="error">An error occurred while attempting to retrieve the ZIP Code data.</p>');
      }
      return;
    }

    /* Create the journal entry using the user input, and send it to the local server. */
    const currentDate = new Date();
    let celsiusTemp = data.main.temp - 273.15;   //The temperature value in the Celsius scale (convert from Kelvin unit)
    let fahrenheitTemp = celsiusTemp * 1.8 + 32; //The temperature value in the Fahrenheit scale
    const journalEntry = {
    temperature: `${fahrenheitTemp.toFixed(2)}°F/${celsiusTemp.toFixed(2)}°C at ${enteredZIP.value}`,
    date: `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`,
    userResponse: enteredFeelings.value
    };

    /* Using Promises once more, send the data to the local server,
     * and then call a function to retrieve all journal entries
     * and to update the UI.
     */
    postJournalData('https://abner-vinaja-weather-journal-app.azurewebsites.net/projectData', journalEntry).then(function(data) {
      loadJournalEntries();
    });
  });
}

/*
 * Purpose: This function updates the UI
 * using all journal entries for the current session.
 * This function gets all journal entries stored by the local
 * server, and then adds them to the UI's entry holder.
 */
function loadJournalEntries() {
  /* Using Promises, get all stored journal entries and update the
   * UI by adding HTML for each journal entry.
   */
  getJournalData('https://abner-vinaja-weather-journal-app.azurewebsites.net/projectData').then(function(projectData) {
    let dateHTML = '<div class="section-title"><h4>Date</h4></div>';               //Write the HTML for the date section.
    let temperatureHTML = '<div class="section-title"><h4>Temperature</h4></div>'; //Write the HTML for the temperature section.
    let feelingsHTML = '<div class="section-title"><h4>Feelings</h4></div>';       //Write the HTML for the feelings section.
    let dateSection = document.getElementById('date');        //Get the element for the date section.
    let tempSection = document.getElementById('temp');        //Get the element for the temperature section.
    let feelingsSection = document.getElementById('content'); //Get the element for the feelings section.

    /* Add each journal entry's data to each section. */
    for(let journalEntry of projectData.journalEntries) {
      dateHTML = dateHTML + `<div class="entry-box"><p class="entry-text">${journalEntry.date}</p></div>`;
      temperatureHTML = temperatureHTML + `<div class="entry-box"><p class="entry-text">${journalEntry.temperature}</p></div>`;
      feelingsHTML = feelingsHTML + `<div class="entry-box"><p class="entry-text">${journalEntry.userResponse}</p></div>`;
    }

    /* Set each section's HTML. */
    dateSection.innerHTML = dateHTML;
    tempSection.innerHTML = temperatureHTML;
    feelingsSection.innerHTML = feelingsHTML;
  });
}

document.addEventListener('DOMContentLoaded', loadJournalEntries);           //Load any existing journal entries when the page is loaded.
document.getElementById('generate').addEventListener('click', generateData); //Generate data when the user submits their input.
