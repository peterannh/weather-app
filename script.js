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

// Forecast Date function

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  return days[day];
}

// Feature 2 - Search function that updates the city name, temperature and secondary information
function displayWeatherInfo(response) {
  celsiusTemperature = response.data.main.temp;

  let cityTemp = Math.round(celsiusTemperature);
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

  getForecast(response.data.coord);
}

function defaultCitySearch(city) {
  let units = "metric";
  let apiKey = "58a6775f97527351bf6c6966e209be39";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  axios.get(apiURL).then(displayWeatherInfo);
}

function userCitySearch(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  defaultCitySearch(city);
}
let citySearchForm = document.querySelector("#city-search");
citySearchForm.addEventListener("submit", userCitySearch);

defaultCitySearch("Tokyo");

// Feature 3 - Show 5 day weather forecast
function displayWeatherForecast(response) {
  let forecast = response.data.daily.slice(1, 6);

  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = "";

  forecast.forEach(function (forecastDay, index) {
    let highestTemp = Math.round(forecastDay.temp.max);
    let lowestTemp = Math.round(forecastDay.temp.min);

    let iconCode = forecastDay.weather[0].icon;
    let iconAltCode = forecastDay.weather[0].description;
    let iconURL = `media/${iconCode}.svg`;
    let iconElement = document.createElement("img");
    iconElement.setAttribute("class", "forecast-icon");
    iconElement.setAttribute("src", iconURL);
    iconElement.setAttribute("alt", iconAltCode);
    iconElement.setAttribute("id", `forecast-icon-${index}`);

    forecastHTML += `
    <div class="d-flex justify-content-center align-items-center weather-forecast-container">
      <div class="col-auto">
        <div class="card-text date-info">${formatForecastDay(
          forecastDay.dt
        )}</div>
        <img class="forecast-icon img-responsive" src="${iconURL}" alt="${iconAltCode}" id="forecast-icon-${index}" />
        <div class="forecast-temp">
          <span class="highest-temp">${highestTemp}°</span>
          <span class="lowest-temp">${lowestTemp}°</span>
        </div>
      </div>
    </div>
  `;
  });

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let units = "metric";
  let apiKey = "58a6775f97527351bf6c6966e209be39";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiURL).then(displayWeatherForecast);
}

// Feature 4 - Current Location Button

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
