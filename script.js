// getting html elments 
var cityForm = document.querySelector('#city-form')
console.log("app connecting");
var searchButton = document.getElementById('search-button');
var input = document.querySelector('#input');
var cityList= document.querySelector('#city-list');
var heading3 = document.querySelector('#heading3');
var one = document.querySelector('#one');
var two = document.querySelector('#two');
var three = document.querySelector('#three');
var four = document.querySelector('#four');
var card = document.querySelector('#card-div');
var description = document.querySelector('#description');
//console.log(searchCity);

var lists =[];
// function setitem(){
//   localStorage.setItem("lists", JSON.stringify(lists));
// }
//Adding event listener to the search button
searchButton.addEventListener('click', function(e) {
      e.preventDefault();
      //getting value from input.
      var inputval = input.value.trim();
      console.log(inputval);
      if (inputval !== null) {
         //passing input value to the url as inputval.
         console.log("clicked");
         fetch('https://api.openweathermap.org/data/2.5/weather?q=' + inputval + '&appid=6344ee4d6da1dac3b28e406f8e63003e')
         //parsing the response data
   .then(response => response.json())
   .then(data =>{ console.log(data);
        //creating li elemnt on the basis of response data name.
         var li = document.createElement('li');
         li.textContent = data.name;
         //li.setAttribute("data-index", i)
         cityList.appendChild(li);
         //clearing the input to prevent multiple request.
         input.value = "";
         lists.push(li);
         console.log(data);
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
      var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
      $('#wicon').attr('src', iconurl);
      description.innerHTML = data['weather']['0']['description'];

    searchlanlon();
    //since first api didn't cover all the data required so there is anoter api call on the basis of latitude and longitude 
    function searchlanlon(){
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
        //for loop to grab the five days data.
        $(".card-div").empty();
        for (var i = 1; i <= 5; i++) {
          // Convert “dt:”
          //card.remove(div);
          
          var dDate = timeConverter(data['daily'][i]['dt']);
          var dTemp = "Temperature: " + Math.round(data['daily'][i]['temp']['max']) + "°F";
          var dHumidity = "Humidity: " + data['daily'][i]['humidity'] + "%";
          var dIconCode = data['daily'][i]['weather']['0']['icon'];
           dIconUrl = "http://openweathermap.org/img/w/" + dIconCode + ".png";
           var img = document.createElement('img'); 
            img.src = dIconUrl;
          var div = document.createElement('div');
         var linebreak = document.createElement('br');
          div.classList.add("card-area");
          div.append(dDate);
          div.appendChild(linebreak);
          div.append(img );
          div.appendChild(linebreak);
          div.append(dTemp );
          div.appendChild(linebreak);
          div.append(dHumidity);
          card.appendChild(div);      
        }
        
      });
    }
    
    
    
   });
  }
            
//var lists = JSON.parse(localStorage.getItem('lists'))
});

function timeConverter(UNIX_timestamp){
      var a = new Date(UNIX_timestamp * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      
      var time = date + ' ' + month + ' ' + year;
      return time;
    }
    console.log(timeConverter(1608829200));







// var body = document.getElementById('body');
// //apikey = 15a98bf4b8e4398115c70b833e8de635
