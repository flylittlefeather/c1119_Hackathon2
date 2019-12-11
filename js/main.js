$(document).ready(initializeApp);
this.processGetSadPoems = this.processGetSadPoems.bind(this);
this.getRandomSadPoem = this.getRandomSadPoem.bind(this);
this.processGetHappyPoems = this.processGetHappyPoems.bind(this);
this.getRandomHappyPoem = this.getRandomHappyPoem.bind(this);

//GLOBAL VARIABLES
var geoLocation = {}
var weatherWord = null;

function initializeApp() {
  applyClickHandlers();
  getLocation();
  getImg("sunny");
}

function applyClickHandlers() {
  $('#getSadPoems').on('click', processGetSadPoems);
  $('#getHappyPoems').on('click', processGetHappyPoems);
}

//Sad Poems
function processGetSadPoems() {
  var ajaxConfig = {
    dataType: 'json',
    url: "http://poetrydb.org/lines/sad/author,title,lines,linecount.json",
    method: 'GET',
    success: this.getRandomSadPoem,
    error: function(error) {
      console.log('processGetSadPoems error:', error);
    },
  }
  $.ajax(ajaxConfig);
}

function getRandomSadPoem(success) {
  var sadPoems = [];
  var allSadPoemsArray = success;

  for (var i = 0; i < allSadPoemsArray.length; i++) {
      if (allSadPoemsArray[i].lines.length < 51) {
        sadPoems.push(allSadPoemsArray[i]);
      }
  }
  var randomSadArray = Math.floor(Math.random()*sadPoems.length-1);
  var randomSadPoemObj = sadPoems[randomSadArray];
  // console.log('randomSadPoem', randomSadPoem);

  // poemBox.empty();
  // authorBox.empty();

  displaySadPoem(randomSadPoemObj);
}

function displaySadPoem(randomSadPoemObj) {
  // console.log(randomSadPoemObj);
  // debugger;
  // randomSadPoemObj.lines.forEach(line => console.log(line)); //display poem in console.log

  var randomSadPoemLinesArray = randomSadPoemObj.lines;
  var poemBox = $('#poemScroll');
  var authorBox = $('#author');
  var titleBox = $('#title');

  for (var i = 0; i < randomSadPoemLinesArray.length; i++) {
    var newLine = $('<div>').attr('class', 'newLine').text(randomSadPoemLinesArray[i]);
    poemBox.append(newLine);
    // debugger;
  }
  titleBox.append(randomSadPoemObj.title);
  authorBox.append(randomSadPoemObj.author);
}


//Happy Poems
function processGetHappyPoems() {
  var ajaxConfig = {
    dataType: 'json',
    url: "http://poetrydb.org/lines/happy/author,title,lines,linecount.json",
    method: 'GET',
    success: this.getRandomHappyPoem,
    error: function (error) {
      console.log('processGetHappyPoems error:', error);
    },
  }
  $.ajax(ajaxConfig);
}

function getRandomHappyPoem(success) {
  var happyPoems = [];
  var allHappyPoemsArray = success;

  for (var i = 0; i < allHappyPoemsArray.length; i++) {
    if (allHappyPoemsArray[i].lines.length < 51) {
      happyPoems.push(allHappyPoemsArray[i]);
    }
  }
  var randomHappyArray = Math.floor(Math.random() * happyPoems.length - 1);
  var randomHappyPoemObj = happyPoems[randomHappyArray];
  // console.log('randomSadPoem', randomSadPoem);

  // poemBox.empty();
  // authorBox.empty();

  displayHappyPoem(randomHappyPoemObj);
}

function displayHappyPoem(randomHappyPoemObj) {
  // console.log(randomSadPoemObj);
  debugger;
  // randomSadPoemObj.lines.forEach(line => console.log(line)); //display poem in console.log

  var randomHappyPoemLinesArray = randomHappyPoemObj.lines;
  var poemBox = $('#poemScroll');
  var authorBox = $('#author');
  var titleBox = $('#title');

  for (var i = 0; i < randomHappyPoemLinesArray.length; i++) {
    var newLine = $('<div>').attr('class', 'newLine').text(randomHappyPoemLinesArray[i]);
    poemBox.append(newLine);
    // debugger;
  }
  titleBox.append(randomHappyPoemObj.title);
  authorBox.append(randomHappyPoemObj.author);
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
