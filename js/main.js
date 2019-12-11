$(document).ready(initializeApp);

this.getWeatherPoems = this.getWeatherPoems.bind(this);
this.processGetPoems = this.processGetPoems.bind(this);
this.getRandomPoem = this.getRandomPoem.bind(this);

//GLOBAL VARIABLES
var weatherWord = null;
var imgSearchWord = weatherWord;

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
      getLocation();
      processGetPoems(weatherWord);
      getImg(weatherWord);
      break;
    case "random":
      var keyword = getRandomWord();
      processGetPoems(keyword);
      getImg(keyword);
      break;
  }
}

// Poems
function processGetPoems(keyword) {
  var ajaxConfig = {
    dataType: 'json',
    url: "http://poetrydb.org/lines/"+ keyword +"/author,title,lines,linecount.json",
    method: 'GET',
    success: this.getPoem,
    error: function(error) {
      console.log('processGetSadPoems error:', error);
    },
  }
  $.ajax(ajaxConfig);
}

function getPoem(success) {
  var poems = [];
  var allPoemsArray = success;

  for (var i = 0; i < allPoemsArray.length; i++) {
      if (allPoemsArray[i].lines.length < 51) {
        poems.push(allPoemsArray[i]);
      }
  }
  var randomPoemIndex = Math.floor(Math.random()*poems.length-1);
  var poemObj = poems[randomPoemIndex];
  // console.log('randomSadPoem', randomSadPoem);

  // poemBox.empty();
  // authorBox.empty();

  displayPoem(poemObj);
}

function displayPoem(poemObj) {
  // console.log(randomSadPoemObj);
  // debugger;
  // randomSadPoemObj.lines.forEach(line => console.log(line)); //display poem in console.log
  var poemLinesArray = poemObj.lines;
  var poemBox = $('#poemScroll');
  var authorBox = $('#author');
  var titleBox = $('#title');

  for (var i = 0; i < poemLinesArray.length; i++) {
    var newLine = $('<div>').attr('class', 'newLine').text(poemLinesArray[i]);
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
      var geoLocation = {};      
      console.log("getCurrentWeather success", response);
      weatherWord = response.weather[0].main; // weatherObj.weather[0].main --> "Clear" weatherObj.weather[0].description --> "clear sky"
      console.log("weatherWord after API call to openWeather:", weatherWord);

     
      // redefine weather word to a search term better suited to the PoetryDB and Pixabay libraries

      switch(weatherWord){
        case "Clear":
          imgSearchWord = "sunny, clear";
          break;
        case "Rain":
          weatherWord = " rain"; // added space to not retrieve irrelevant poems focusing on "train", "strain", etc. instead of "rain"
          break;
        case "Clouds":
          imgSearchWord = response.weather[0].description; //more specific images (but sometimes only a few, <20)
          weatherWord = "cloud";
          break;
        }
      console.log("imgSearchWord", imgSearchWord);
      console.log("new weatherWord", weatherWord);
      
    },
    error: function (error) {
      console.log("error in getCurrentWeather", error);
    },
  }
  $.ajax(weatherObj);
  console.log("geoLocation", geoLocation);
}

// weather conditions list: https://openweathermap.org/weather-conditions
function getRandomWord(){
  return "party";
}
