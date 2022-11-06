const apiKey = "99b8f9330a1bfba3a85e523fd3c2e528";

const displayedDesc = document.querySelector(".description");
const temperature = document.getElementsByClassName("temp");
const humidity = document.getElementsByClassName("humidity");
const getLocalWeatherBtn = document.querySelector("#btn-currentWeather");
let currentHumidity;
let temp;

const form = document.querySelector("#search-form");
const gotCity = document.querySelector("#city");
const wind = document.querySelector("#wind");
const newNameOfCity = document.querySelector("#name-of-city");
const loading = document.querySelector("#loading");
const iconElement = document.querySelector("#icon");
const sunriseElement = document.querySelector("#sunrise");
const sunsetElement = document.querySelector("#sunset");

showLocalWeather();

function showWeather(res) {
  if (res) {
    loading.classList.add("hide");
    iconElement.classList.remove("hide");
  }

  const sunrise = res.data.sys.sunrise;
  const sunset = res.data.sys.sunset;
  const sunriseData = new Date(sunrise * 1000).toLocaleTimeString();
  const sunsetData = new Date(sunset * 1000).toLocaleTimeString();
  currentHumidity = res.data.main.humidity;
  temp = Math.round(res.data.main.temp);
  let speedOfWind = Math.round(res.data.wind.speed);
  let description = res.data.weather[0].description;
  let city = res.data.name;
  sunriseElement.innerHTML = `Sunrise: ☀️ ${sunriseData}`;
  sunsetElement.innerHTML = `Sunset: 🌑 ${sunsetData}`;
  temperature[0].innerHTML = `${temp}`;
  humidity[0].innerHTML = `Humidity: ${currentHumidity} %`;
  wind.innerHTML = `Wind: ${speedOfWind} km/h`;
  displayedDesc.innerHTML = `${description}`;
  newNameOfCity.innerHTML = `${city}`;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`
  );
}
const writeCurentTemp = (event) => {
  event.preventDefault();
  if (gotCity.value) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${gotCity.value}&appid=${apiKey}&&units=metric`;
    axios.get(apiUrl).then((res) => {
      showWeather(res);
      const dailyApiUrl = `
https://api.openweathermap.org/data/2.5/onecall?lat=${res.data.coord.lat}&lon=${res.data.coord.lon}&appid=${apiKey}&&units=metric`;

      axios.get(dailyApiUrl).then(showForecast);
    });
  }
  event.target.reset();
};
function showForecast(res) {
  const forecastElement = document.querySelector("#weather-forecast");
  const forecast = res.data.daily;
  let forecastHtml = `<div class="row">`;

  forecast.forEach((forecastDay, index) => {
    if (index < 6) {
      forecastHtml += `     <div class="col-2">
              <div>${new Date(forecastDay.dt * 1000)
                .toDateString()
                .slice(0, 10)}</div>
              <img src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png" alt="Clear" id="iconForecast" />
              <div class="forecast-temp">
                <span class="forecast-temp-max">${Math.round(
                  forecastDay.temp.max
                )}°</span>
                <span class="forecast-temp-min">${Math.round(
                  forecastDay.temp.min
                )}°</span></div></div>`;
    }
  });

  forecastHtml += `</div>`;

  forecastElement.innerHTML = forecastHtml;
}
form.addEventListener("submit", writeCurentTemp);

function showLocation(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
  const dailyLocalApiUrl = `
https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${apiKey}&&units=metric`;

  axios.get(dailyLocalApiUrl).then(showForecast);
}

function showLocalWeather() {
  navigator.geolocation.getCurrentPosition(showLocation);
}

getLocalWeatherBtn.addEventListener("click", showLocalWeather);
