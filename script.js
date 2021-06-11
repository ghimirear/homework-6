// getting html elments 
var cityForm = document.querySelector('#city-form')
//just to make sure files are connected.
console.log("app connecting");
var searchButton = document.getElementById('search-button');
var input = document.querySelector('#input');
var cityList= document.querySelector('#city-list');
var heading3 = document.querySelector('#heading3');
var one = document.querySelector('#one');
var two = document.querySelector('#two');
var three = document.querySelector('#three');
var four = document.querySelector('#four');
var card = document.querySelector('.card-div');
var description = document.querySelector('#description');
var upperDiv = document.querySelector('#upperDiv');
var errorm = document.querySelector('#error');
iconPlace = document.querySelector("#icon");
// function init to grab stored city list.
init();
var storedlist =JSON.parse(localStorage.getItem('lists'));
function init(){
  var storedlist =JSON.parse(localStorage.getItem('lists'));
  console.log(storedlist);
  if (storedlist !== null) {
    //if stored vaule is not equal to null then 
      for (var i = 0; i < storedlist.length; i++) {
        var li = document.createElement('li');
        li.setAttribute["data-index", i]
        li.textContent= storedlist[i];
        cityList.appendChild(li);
        values = cityList.lastChild.textContent;
        console.log(values);
        input.value = values;
        console.log(input.value);
      }  
  }
  else if (storedlist === null){
    return;
  };
}

//whenever document ready triggering the search button with the value of last city search so that it always display last city results.
$(document).ready(function () {
  if (storedlist !== null) {
   var svalue = cityList.lastChild.getAttribute('data-index');
   getData(svalue);
   cityList.removeChild(cityList.children.textContent == svalue);
  }
  

});
//variable lists to store the city name.
var lists =[];
//function to store city name in local storage
 function setitem(){
   localStorage.setItem("lists", JSON.stringify(lists));
 }
//Adding event listener to the search button

searchButton.addEventListener('click', function(e) {
  e.preventDefault();
  var inputval = input.value.trim();
  console.log(inputval);
  if(inputval === ""){
    return
  }
  getData(inputval);
});
// function to get data from the open weather data
function getData(inputval){
  console.log(inputval)
  $(".icon").empty();
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=`+inputval+`&appid=6344ee4d6da1dac3b28e406f8e63003e`)
     //parsing the response data
    .then(response =>response.json())
    .then(data =>{ console.log(data);
    //creating li elemnt on the basis of response data name.
    
      if (data.name !== undefined) {
        var li = document.createElement('li');
        li.textContent = data.name;
      lists.push(data.name);
      cityList.appendChild(li);
     } 
     
     errorm.textContent = "";
     //clearing the input to prevent multiple request.
     input.value = "";
     console.log(data.name);
     setitem();
     console.log(data);
     //if result came undefined if any error occured.
     while (data.name === undefined) {
       $(".card-div").empty();
      errorm.textContent= "please enter a valid city name...";
      return;
    }
     //grabbing latitude and longitude and passing that value to searchlanlon function.
  var  lat= data['coord']['lat'];
  // console.log('latitude ' + lat);
  var  lon= data['coord']['lon'];
   //console.log("laongitude " + lon);
   // grabbing the current date from the response data and converting to normal date format
   var date = timeConverter(data['dt']);
  heading3.innerHTML = data.name +' (' + date + ')';
  //same with the temperature
  var temp = parseFloat(data['main']['temp']);
  var temperature = ((temp-273.15)*1.8)+32;
  one.innerHTML = "Temperature: " + Math.round(temperature) + "°f";
  //here come humidity
  var humidity = data['main']['humidity'];
  two.innerHTML = "Humidity: " + humidity + '%';
  //wind speed from nautical mile to normal mile.
  var windspeed = parseFloat(data['wind']['speed']);
  three.innerHTML= "windspeed: " + Math.round( windspeed * 1.15) + 'mph';
  //current weather icon
  var iconCode = data['weather'][0]['icon'];
  //constructing icon url on the basis of code 
  var img = document.createElement('img');
  var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
  img.src= iconurl;
  iconPlace.append(img);
  description.innerHTML = data['weather']['0']['description'];
 //envoking the searchlanlon.    
  searchlanlon(lat, lon);
  });
}

// function to get data from latitude and longitude
function searchlanlon(lat, lon){
  console.log(lat, lon)
  fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial' + '&appid=6344ee4d6da1dac3b28e406f8e63003e')
  .then(response => response.json())
  .then(data =>{ 
    console.log(data);
    //uv index value form the resonse data
    var uvIndex= parseFloat(data['current']['uvi']);
    four.innerHTML = 'UV Index: ' + uvIndex;
    // if uv idex is to high giving the background color to emphasize 
    if (parseFloat(uvIndex) > 4) {
      four.classList.add('red');
    }
    else{
      four.classList.remove("red");
    }
    //emptying the card-div to append new element.
    //for loop to grab the five days data.
    $(".card-div").empty();
    for (var i = 1; i <= 5; i++) {
      //starting from no.1 position because the index 0 is current day.
      var dDate = timeConverter(data['daily'][i]['dt']);
      var dTemp = "Temperature: " + Math.round(data['daily'][i]['temp']['max']) + "°F";
      var dHumidity = "Humidity: " + data['daily'][i]['humidity'] + "%";
      var dIconCode = data['daily'][i]['weather']['0']['icon'];
      // creating icon url on the basis of icon code and openweather website.
       dIconUrl = "http://openweathermap.org/img/w/" + dIconCode + ".png";
       //creating image element
       var img = document.createElement('img'); 
       //assigining source to that image.
        img.src = dIconUrl;
      // creating div element to hold all the data that come from the api call.
      var div = document.createElement('div');
     var linebreak = document.createElement('br');
     // assigining the class of card area to that div
      div.classList.add("card-area");
      //appending all the element to that created div element.
      div.append(dDate);
      div.appendChild(linebreak);
      div.append(img );
      div.appendChild(linebreak);
      div.append(dTemp );
      div.appendChild(linebreak);
      div.append(dHumidity);
      //appending div to the DOM as a child.
      card.appendChild(div);      
    } 
  });
} 


//time converter function which take the data from the cpi call and convert to normal.
function timeConverter(UNIX_timestamp){
      var a = new Date(UNIX_timestamp * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday']
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var day = days[a.getDay()]
      var date = a.getDate();
      
      var time = day + ' '+ date + ' ' + month + ' ' + year;
      return time;
}
//consoling timeconverter just to show it is working.

    console.log(timeConverter(1608829200));

// evend delegation for the list items
$("#city-list").on("click", "li", function () {
  console.log(this);
  var thisvalue = this.textContent;
  console.log(thisvalue);
  getData(thisvalue);
  cityList.removeChild(this);
  //on the basis of click assigning that text content value to the input value and triggering the search button.
})
