const apiKey = "99b8f9330a1bfba3a85e523fd3c2e528";

const displayedDesc = document.querySelector(".description");
const temperature = document.getElementsByClassName("temp");
const humidity = document.getElementsByClassName("humidity");
const getLocalWeatherBtn = document.querySelector("#btn-currentWeather");
let fahrenheit;
let currentHumidity;
let temp;

const form = document.querySelector("#search-form");
const gotCity = document.querySelector("#city");
const celsiumLink = document.querySelector("#celsium");
const fahrenheitLink = document.querySelector("#fahrenheit");
const wind = document.querySelector("#wind");
const newNameOfCity = document.querySelector("#name-of-city");
const loading = document.querySelector("#loading");
const iconElement = document.querySelector("#icon");
const sunriseElement = document.querySelector("#sunrise");
const sunsetElement = document.querySelector("#sunset");
function showWeather(res) {
  if (res) {
    loading.classList.add("hide");
    iconElement.classList.remove("hide");
  }
  console.log(res);

const sunrise = res.data.sys.sunrise;
const sunset = res.data.sys.sunset;
const sunriseData = new Date(sunrise * 1000).toLocaleTimeString();
const sunsetData = new Date(sunset * 1000).toLocaleTimeString();
  currentHumidity = res.data.main.humidity;
  temp = Math.round(res.data.main.temp);
  let speedOfWind = res.data.wind.speed;
  let description = res.data.weather[0].description;
  let city = res.data.name;
  sunriseElement.innerHTML = `Sunrise: ☀️ ${sunriseData}`;
  sunsetElement.innerHTML = `Sunset: 🌑 ${sunsetData}`;
  temperature[0].innerHTML = `${temp}`;
  humidity[0].innerHTML = `Humidity: ${currentHumidity} %`;
  wind.innerHTML = `Wind: ${speedOfWind}km/h`;
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
    axios.get(apiUrl).then(showWeather);
  }
};
form.addEventListener("submit", writeCurentTemp);
const changeTemptoCelsium = (event) => {
  event.preventDefault();
  celsiumLink.classList.add("pressed");
  fahrenheitLink.classList.remove("pressed");
  temperature[0].innerHTML = `${temp}`;
};
const changeTemptoFahrenheit = (event) => {
  event.preventDefault();
  fahrenheitLink.classList.add("pressed");
  celsiumLink.classList.remove("pressed");
  fahrenheit = Math.round((temp * 9) / 5 + 32);
  temperature[0].innerHTML = `${fahrenheit}`;
};
function showLocation(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function showLocalWeather() {
  navigator.geolocation.getCurrentPosition(showLocation);
}
showLocalWeather();

celsiumLink.addEventListener("click", changeTemptoCelsium);
fahrenheitLink.addEventListener("click", changeTemptoFahrenheit);
getLocalWeatherBtn.addEventListener("click", showLocalWeather);
