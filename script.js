// Feature 1 - Current date and time
let now = new Date();
function formatDate(date) {
  let day = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  let month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let currentDay = day[now.getDay()];
  let currentMonth = month[now.getMonth()];
  let currentDayOfMonth = now.getDate();
  let currentTime = `${hours}:${minutes}`;
  let formattedDate = `${currentDay} ${currentMonth} ${currentDayOfMonth} ${currentTime}`;

  let currentDateTime = document.getElementById("current-date-time");
  currentDateTime.innerHTML = formattedDate;
}

formatDate(now);

// Feature 2 - Search function that updates the city name, temperature and secondary information
function displayWeatherInfo(response) {
  console.log(response);

  celciusTemperature = response.data.main.temp;

  let cityTemp = Math.round(celciusTemperature);
  let currentTempValue = document.querySelector("#current-temp-value");
  currentTempValue.innerHTML = cityTemp;

  let searchedCityName = response.data.name;
  let searchedCityElement = document.querySelector("#searched-city");
  searchedCityElement.innerHTML = searchedCityName;

  let iconCode = response.data.weather[0].icon;
  let iconAltCode = response.data.weather[0].description;
  let iconURL = `media/${iconCode}.svg`;
  let iconElement = document.querySelector("#todays-icon");
  iconElement.setAttribute("src", iconURL);
  iconElement.setAttribute("alt", iconAltCode);

  let weatherDescription = response.data.weather[0].main;
  let weatherDescriptionElement = document.querySelector(
    "#weather-description"
  );
  weatherDescriptionElement.innerHTML = weatherDescription;

  let humidityPercentage = response.data.main.humidity;
  let humidityPercentageElement = document.querySelector("#humdity-percentage");
  humidityPercentageElement.innerHTML = ` ${humidityPercentage}%`;

  let windMeasurement = Math.round(response.data.wind.speed);
  let windMeasurementElement = document.querySelector("#wind-measurement");
  windMeasurementElement.innerHTML = ` ${windMeasurement} km/h`;
}

function defaultCitySearch(city) {
  let units = "metric";
  let apiKey = "58a6775f97527351bf6c6966e209be39";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiURL).then(displayWeatherInfo);
  console.log(apiURL);
}

function userCitySearch(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  defaultCitySearch(city);
}
let citySearchForm = document.querySelector("#city-search");
citySearchForm.addEventListener("submit", userCitySearch);

defaultCitySearch("Tokyo");

function displayWeatherForecast() {
  let forecastElement = document.querySelector("#weather-forecast");

  let days = ["Thu", "Fri", "Sat", "Sun", "Mon"];

  let forecastHTML = "";

  days.forEach(function (day) {
    forecastHTML += `
      <div class="d-flex justify-content-center align-items-center weather-forecast-container">
        <div class="col-auto">
          <div class="card-text date-info">${day}</div>
          <img class="forecast-icon img-responsive" src="media/03d.svg" alt="Cloudy icon" />
          <div class="forecast-temp">
            <span class="highest-temp">27°</span>
            <span class="lowest-temp">23°</span>
          </div>
        </div>
      </div>
    `;
  });

  forecastElement.innerHTML = forecastHTML;
}

displayWeatherForecast();

// Feature 3 - Current Location Button

function currentLocationSearch(position) {
  let apiKey = "58a6775f97527351bf6c6966e209be39";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiURL).then(displayWeatherInfo);
}

function getCurrentLocation(event) {
  navigator.geolocation.getCurrentPosition(currentLocationSearch);
}

let currentLocationBtn = document.getElementById("current-location-btn");
currentLocationBtn.addEventListener("click", getCurrentLocation);

// Feature 4 - Switch between celcius and farenheit

function changeToFahrenheit(event) {
  event.preventDefault();
  let farenheitValue = (celciusTemperature * 9) / 5 + 32;
  // Remove the active class from the celcius link
  celciusTemp.classList.remove("active-temp-link");
  fahrenheitTemp.classList.add("active-temp-link");
  let currentFarenheitTemp = document.querySelector("#current-temp-value");
  currentFarenheitTemp.innerHTML = Math.round(farenheitValue);
}

function changeToCelcius(event) {
  event.preventDefault();
  celciusTemp.classList.add("active-temp-link");
  fahrenheitTemp.classList.remove("active-temp-link");
  let curentCelciusTemp = document.querySelector("#current-temp-value");
  curentCelciusTemp.innerHTML = Math.round(celciusTemperature);
}

let celciusTemperature = null;

let fahrenheitTemp = document.querySelector("#fahrenheit-temp-link");
fahrenheitTemp.addEventListener("click", changeToFahrenheit);

let celciusTemp = document.querySelector("#celcius-temp-link");
celciusTemp.addEventListener("click", changeToCelcius);
