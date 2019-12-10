$(document).ready(initializeApp);

//GLOBAL VARIABLES
var geoLocation = {}
//geoLocation.lat gives you

function initializeApp(){
  getLocation();
  getImg("sunny")
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
  return geoLocation;
}

function getImg(keyword){
  var imgObj = {
    url: "https://pixabay.com/api/",
    method: "GET",
    data:{
      key:"14581706-5fa585255d8b483110ef3bfe9",
      q: keyword
    },
    success: handleSuccessImg,
    error: console.log
  };

  $.ajax(imgObj);
}

function handleSuccessImg(response){
  var random = parseInt(Math.random()*20);
  var url = response.hits[random].largeImageURL;

  $("img").attr("src", url);

}
