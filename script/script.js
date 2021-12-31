// check the user location 
let userLat, userLng;
if (window.navigator) {
  const successCallBack = function (position) {
    setMessage("Loading..")
    userLat = position.coords.latitude;
    userLng = position.coords.longitude;
    console.log("lat:", userLat, "lng:", userLng);
    searchWeather(userLat, userLng);
  }
  window.navigator.geolocation.getCurrentPosition(
    successCallBack
  )
}


// autocomplete input with google places api 
let googleLat, googleLng;
$(document).ready(function () {
  const options = {
    type: ['geocode']
  }
  const autocomplete = new google.maps.places.Autocomplete((document.getElementById('userInput')), options.type);
  google.maps.event.addListener(autocomplete, 'place_changed', function () {
    const near_place = autocomplete.getPlace();
    googleLat = near_place.geometry.location.lat();
    googleLng = near_place.geometry.location.lng();
    searchWeather(googleLat, googleLng)
    searchImage(userInput.value)
  });

});


// search function where i have the fetch.
function searchWeather(lat, lon) {
  const KEY = '0dfd77cf23ff4e86a2b0a2b599e3574b';
  const dailyUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${KEY}&lang=sv`;
  const currentUrl = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${KEY}&lang=sv`;

  fetch(currentUrl).then(
    function (response2) {
      if (response2.status >= 200 && response2.status < 300) {
        return response2.json();
      }
      else {
        throw 'Something went wrong. :(';
      }
    }
  ).then(
    function (data) {
      setMessage(" ");
      todayDiv.style.display = 'block';
      // const {city_name} = data   ===  const city_name = data.city_name 
      const { pod, city_name, country_code, temp, wind_spd, rh } = data.data[0];
      const { description, icon, code } = data.data[0].weather;
      dayNight = pod;
      weatherCode = code;
      turpinSpeed = 0.01 * Math.floor(wind_spd)
      $('.city-name').html('City: ' + city_name + ' ' + country_code);
      $('.temperature').html('Temperature: ' + Math.floor(temp) + "°C");
      $('.description').html(description);
      $('.wind-speed').html('Wind Speed: ' + Math.floor(wind_spd));
      $('.wind-humidity').html('Wind Humidity: ' + Math.floor(rh) + '%');
      $('.weather-icon-image').attr("src", `https://www.weatherbit.io/static/img/icons/${icon}.png`);
    }
  ).catch(
    function (error1) {
      console.log(error1);
    }
  );

  fetch(dailyUrl).then(
    function (response) {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      else {
        throw 'Something went wrong. :(';
      }
    }
  ).then(
    function (data) {
      setMessage(" ");
      clearDiv();
      // Loop som hämta data o skapa 5 div med beskrivning, img5, tempratur o datum, o sätta data i de
      for (let i = 1; i < 6; i++) {
        const { datetime, temp } = data.data[i];
        const { description, icon } = data.data[i].weather;
        const days = $("<div></div>");
        let description5 = $("<p></p>").html(description);
        let img5 = $("<img></img>").attr("src", `https://www.weatherbit.io/static/img/icons/${icon}.png`);
        let temperature5 = $("<p></p>").html(Math.floor(temp) + "°C");
        let date = $("<p></p>").html(datetime);
        $(days).append(date, temperature5, img5, description5);
        $('#five-days').append(days);
        fiveDays.style.display = 'flex';
      }
    }
  ).catch(
    function (error) {
      setMessage("Sorry !! couldn't find any matching city for weather , Please try again with another city");
      console.log(error);
      clearDiv()
    }
  );
}


// clear the fiveDays div from the old search 
function clearDiv() {
  const divEl = $('#five-days *');
  for (let el of divEl) {
    el.remove()
  };
}


// error and loading message 
function setMessage(message) {
  $("#message").html(message);
}


// styling
let searchInput = 'search_input';
let userInput = document.querySelector('#userInput');
let fiveDays = document.querySelector('#five-days');
let todayDiv = document.querySelector('.today');
todayDiv.style.display = 'none';
fiveDays.style.display = 'none';


// Div Background with flickr 
function searchImage(searchText) {
  const flickerKey = '33cb1898c0e2867524bc169b333e42ec';
  const url = `https://www.flickr.com/services/rest/?api_key=${flickerKey}&method=flickr.photos.search&text=${searchText}&sort=relevance&safe_search=1&accuracy=1&content_type=1&format=json&nojsoncallback=1&per_page=1&page=7`;
  fetch(url).then(
    function (response) {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      else {
        throw 'Something went wrong. :(';
      }
    }
  ).then(
    function (data) {
      getImageUrl(data.photos.photo[0]);
    }
  ).catch(
    function (error) {
      console.log(error);
    }
  );
}
function getImageUrl(photoObject) {
  let imgUrl = `https://live.staticflickr.com/${photoObject.server}/${photoObject.id}_${photoObject.secret}.jpg`;
  document.querySelector('.today').style.backgroundImage = `url(${imgUrl})`;
}
