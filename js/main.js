$(document).ready(initializeApp);

//GLOBAL VARIABLES
var geoLocation = {}
//geoLocation.lat gives you

function initializeApp(){
  getLocation();
}

//uses the window.navigator to grab users location
function getLocation(){
  var location = navigator.geolocation.getCurrentPosition(handleSuccessLocation)
}

//takes the longitude and latitute from that response and returns an
//object with .lat = latitude and .long = longitude
function handleSuccessLocation(response){
  geoLocation.lat = parseInt(response.coords.latitude);
  geoLocation.long = parseInt(response.coords.longitude);
  console.log(geoLocation);
  return geoLocation;
}
