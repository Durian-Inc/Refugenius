////////////////////////////////////////////////////////////////////////////////
// DURIAN INC.
////////////////////////////////////////////////////////////////////////////////

var ROOT_URL_FOR_GET_DATA = 'http://localhost:5000/api/query'

var loadingData = [
  {
    "name": "Loading...",
    "addresss": "",
    "phone": "",
    "type": "",
    "languages": [""]
  },
  {
    "name": "Loading...",
    "addresss": "",
    "phone": "",
    "type": "",
    "languages": [""]
  },
  {
    "name": "Loading...",
    "addresss": "",
    "phone": "",
    "type": "",
    "languages": [""]
  }
]

function logError(error) {
  console.log('There was an error: \n', error);
}

////////////////////////////////////////////////////////////////////////////////
// Geolocation
////////////////////////////////////////////////////////////////////////////////

function getUserCurrentLocation() {
  var options = {maximumAge: 50 * 60 * 1000};
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  })
  .then(onGeolocationSuccess)
  .catch(onGeolocationError);
}

function onGeolocationSuccess(position) {
  return position.coords;
}

function onGeolocationError(error) {
  logError(error);
  switch (error.code) {
    case 0: console.log('\tUnknown error'); break;
    case 1: console.log('\tPermission denied'); break;
    case 2: console.log('\tPosition unavailable ' +
        '(error response from location provider)'); 
      break;
    case 3: console.log('\tTimed out'); break;
  }
};

////////////////////////////////////////////////////////////////////////////////
// Profile
////////////////////////////////////////////////////////////////////////////////

function getProfileForUser() {
  return getUserCurrentLocation()
    .then((coordinates) => {
      return {
        lat: coordinates.latitude,
        lon: coordinates.longitude,
        query: "" //TODO
      };
    });
}


////////////////////////////////////////////////////////////////////////////////
// Database interfacing
////////////////////////////////////////////////////////////////////////////////

/* Calls backend with profile of the current user
   Returns a list of locations/events to display w/relevant information */
function getListFromDatabaseUsingProfile(profile) {
  return fetch(getParameterizedDatabaseUrl(profile))
    .then(validateJSONResponse)
};

function getParameterizedDatabaseUrl(profile) {
  // break the profile into its respective parameters
  paramString = '?';
  for (let param in profile) {
    paramString += `${param}=${profile[param]}&`
  }
  // remove extra ampersand
  paramString = paramString.substring(0, paramString.length - 1);
  return ROOT_URL_FOR_GET_DATA + paramString;
}

function validateJSONResponse(response) {
  // check status of HTTP response
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response.json();
}


////////////////////////////////////////////////////////////////////////////////
// Front-end/formatting
////////////////////////////////////////////////////////////////////////////////

function formatListOfData(jsonResponse) {
  mapBois = document.getElementsByClassName("xERobd");
  if(mapBois.length > 0) {
    var mapBoi = mapBois[0];
    mapBoi.innerHTML = "";
    
  }
};


////////////////////////////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////////////////////////////

function onDocumentLoaded() {
  formatListOfData(loadingData);
  /* determine if geolocation is supported; 
     only continue if so */
  var zipCodeProvided = false;
  var enabled = navigator.geolocation || zipCodeProvided;
  if (!enabled) {
    return;
  }

  getProfileForUser()
  .then(getListFromDatabaseUsingProfile)
  //.then((result) => {console.log(result)})
  .then(formatListOfData)
  .catch(logError);
};


window.onload = onDocumentLoaded;







