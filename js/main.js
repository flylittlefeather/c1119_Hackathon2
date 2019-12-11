$(document).ready(initializeApp);
this.processGetPoems = this.processGetPoems.bind(this);
this.getRandomPoem = this.getRandomPoem.bind(this);


//GLOBAL VARIABLES
var geoLocation = {}
var weatherWord = null;

function initializeApp() {
  applyClickHandlers();
}

function applyClickHandlers() {
  // $('#getSadPoems').on('click', processGetSadPoems);
  // $('#getHappyPoems').on('click', processGetHappyPoems);
  $("#happy").on('click', handleClick);
  $("#sad").on('click', handleClick);
  $("#weather").on('click', handleClick);
  $("#random").on('click', handleClick);
}

//functions for each button
function handleClick(event){
  var currentTarget = $(event.currentTarget).attr("id");
  $(".startModal").addClass("hide");
  $(".loader").removeClass("hide");


  switch (currentTarget) {
    case "happy":
      processGetPoems("happy");
      getImg("happy");
      break;
    case "sad":
      processGetPoems("sad");
      getImg("sad");
      break;
    case "weather":
      var keyword = getWeatherWord();
      processGetPoems(keyword);
      getImg(weatherWord);
      break;
    case "random":
      var keyword = getRandomWord();
      processGetPoems(keyword);
      getImg(keyword);
      break;
  }
}


//Sad Poems
function processGetPoems(keyword) {
  var ajaxConfig = {
    dataType: 'json',
    url: "http://poetrydb.org/lines/"+ keyword +"/author,title,lines,linecount.json",
    method: 'GET',
    success: this.getRandomPoem,
    error: function(error) {
      console.log('processGetSadPoems error:', error);
    },
  }
  $.ajax(ajaxConfig);
}

function getRandomPoem(success) {
  var poems = [];
  var allPoemsArray = success;

  for (var i = 0; i < allPoemsArray.length; i++) {
      if (allPoemsArray[i].lines.length < 51) {
        poems.push(allPoemsArray[i]);
      }
  }
  var randomArray = Math.floor(Math.random()*poems.length-1);
  var randomPoemObj = poems[randomArray];
  // console.log('randomSadPoem', randomSadPoem);

  // poemBox.empty();
  // authorBox.empty();

  displayPoem(randomPoemObj);
}

function displayPoem(randomPoemObj) {
  // console.log(randomSadPoemObj);
  // debugger;
  // randomSadPoemObj.lines.forEach(line => console.log(line)); //display poem in console.log
  var randomPoemLinesArray = randomPoemObj.lines;
  var poemBox = $('#poemScroll');
  var authorBox = $('#author');
  var titleBox = $('#title');

  for (var i = 0; i < randomPoemLinesArray.length; i++) {
    var newLine = $('<div>').attr('class', 'newLine').text(randomPoemLinesArray[i]);
    poemBox.append(newLine);
    // debugger;
  }
  titleBox.append(randomPoemObj.title);
  authorBox.append(randomPoemObj.author);
  $(".loader").addClass("hide");
  $("#poems").removeClass("hide");
}


//uses the window.navigator to grab users location
function getLocation(){
  var location = navigator.geolocation.getCurrentPosition(handleSuccessLocation)
}

//takes the longitude and latitute from that response and returns an
//object with .lat = latitude and .long = longitude
function handleSuccessLocation(response){
  geoLocation.lat = parseFloat(response.coords.latitude).toFixed(2); // 2 decimal places for location accuracy
  geoLocation.long = parseFloat(response.coords.longitude).toFixed(2);
  getCurrentWeather(geoLocation.lat, geoLocation.long);
  return geoLocation; // values for lat/long are strings
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


function getCurrentWeather(lat, lon) {
  var weatherObj = {
    data: {
      key: "505564dd065ac29045347220f1b41bec"
    },
    url: "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&APPID=505564dd065ac29045347220f1b41bec",
    // url: "http://api.openweathermap.org/data/2.5/weather?id=5368381&APPID=505564dd065ac29045347220f1b41bec",
    method: "GET",
    dataType: "json",
    success: function (response) {
      console.log("getCurrentWeather success", response);
      weatherWord = response.weather[0].main; // weatherObj.weather[0].main --> "Clear" weatherObj.weather[0].description --> "clear sky"
      console.log("weatherWord after API call to openWeather:", weatherWord);
    },
    error: function (error) {
      console.log("error in getCurrentWeather", error);
    },
  }
  $.ajax(weatherObj);
  console.log("geoLocation", geoLocation);
}
// weather conditions list: https://openweathermap.org/weather-conditions

function getWeatherWord(){
  return "rain";
}

function getRandomWord(){
  return "party";
}
