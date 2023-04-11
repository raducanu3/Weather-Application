import { BACKGROUND_MAP } from './backgroundCode';
import { ICON_MAP } from './iconCode';

const api = 'https://api.openweathermap.org/data/2.5/weather';
const apiForecast = 'https://api.openweathermap.org/data/3.0/onecall';
const apiKey = '1274cc8cfa20251cbcca5a359fd4ad7b';

const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const addToFavoritesButton = document.querySelector('.add-to-favorites');

const currentIcon = document.querySelector('[data-current-icon]');
const getIconUrl = function (iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
};
const getBackgroundUrl = function (iconCode) {
  return `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/backgrounds/${BACKGROUND_MAP.get(
    iconCode
  )}.jpg')`;
};

const background = document.querySelector('.main-info');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const city = document.getElementById('location');
const currentHigh = document.getElementById('data-current-high');
const currentMin = document.getElementById('data-current-min');
const currentWind = document.getElementById('data-current-wind');
const currentFeelsLike = document.getElementById('data-current-fl');

const forecastSection = document.getElementById('forecast');
const dayRowCardTemplate = document.getElementById('day-section');

const dailySection = document.querySelector('.day-section');
const dayCardTemplate = document.getElementById('day-card-template');

const onSuccess = position => {
  const lat = position?.coords?.latitude;
  const lon = position?.coords?.longitude;
  const urlCurrent = `${api}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  getWeatherData(urlCurrent);
};

const onError = error => {
  alert(
    'Error. You disabled your current location. Please enable it and refresh the page!'
  );
};

navigator.geolocation.getCurrentPosition(onSuccess, onError);
const setValue = function (selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
};

const setCurrentWeather = function (weatherData, forecastData) {
  background.style.backgroundImage = getBackgroundUrl(
    weatherData.weather[0].icon
  );
  currentIcon.src = getIconUrl(weatherData.weather[0].icon);
  temperature.innerHTML = Math.round(weatherData.main.temp);
  description.innerHTML = weatherData.weather[0].description;
  city.innerHTML = weatherData.name;
  currentHigh.innerHTML = Math.round(forecastData.daily[0].temp.max);
  currentMin.innerHTML = Math.round(forecastData.daily[0].temp.min);
  currentWind.innerHTML = Math.round(weatherData.wind.speed);
  currentFeelsLike.innerHTML = Math.round(weatherData.main.feels_like);
};

const setDailyWeather = function (forecastData) {
  dailySection.innerHTML = '';
  const timezone = forecastData.timezone;

  forecastData.daily.slice(1).forEach(day => {
    const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      timeZone: timezone,
    });
    const { dt } = day;
    const tempDay = Math.round(day.temp.day);
    const dayName = DAY_FORMATTER.format(dt * 1000);

    const element = dayCardTemplate.content.cloneNode(true);
    setValue('temp-day', tempDay, { parent: element });
    setValue('date-day', dayName, { parent: element });
    element.querySelector('[data-icon-day]').src = getIconUrl(
      day.weather[0].icon
    );
    dailySection.append(element);
  });
};

const setHourlyWeather = function (forecastData) {
  forecastSection.innerHTML = '';
  const timezone = forecastData.timezone;

  forecastData.hourly.slice(1, 25).forEach(hourly => {
    const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      timeZone: timezone,
    });
    const { dt, temp: hourlyTemp, feels_like: feelsLike } = hourly;
    const hour = HOUR_FORMATTER.format(dt * 1000);
    const descriptionHourly = hourly.weather[0].description;

    const element = dayRowCardTemplate.content.cloneNode(true);
    setValue('time-hourly', hour, { parent: element });
    setValue('temp-hourly', Math.round(hourlyTemp), { parent: element });
    setValue('feels-like-temp-hourly', Math.round(feelsLike), {
      parent: element,
    });
    setValue('description-hourly', descriptionHourly, { parent: element });
    element.querySelector('[data-icon-hourly]').src = getIconUrl(
      hourly.weather[0].icon
    );

    forecastSection.append(element);
  });
};

const getWeatherData = async url => {
  try {
    const currentData = await fetch(url);
    const weatherData = await currentData.json();
    const { lat, lon } = weatherData.coord;
    const forecast = await fetch(
      `${apiForecast}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecast.json();
    setCurrentWeather(weatherData, forecastData);
    setDailyWeather(forecastData);
    setHourlyWeather(forecastData);
  } catch (err) {
    alert('Location was not found! Try another location');
  }
  document.body.classList.remove('blurred');
};

const getCityWeather = city => {
  const searchval = searchInput.value;
  let cityName = '';
  if (city) {
    cityName = city;
  } else {
    cityName = searchval;
  }

  const cityUrl = `${api}?q=${cityName}&appid=${apiKey}&units=metric`;
  getWeatherData(cityUrl);

  searchInput.value = '';
};

searchBtn.addEventListener('click', () => getCityWeather());
document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    getCityWeather();
  }
});

const storedFavorites = localStorage.getItem('favorites');
const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

const favoritesList = document.querySelector('.favorites ul');
const saveFavorites = function () {
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

const removeFavorite = function (id) {
  const index = favorites.findIndex(favorite => favorite.id === id);

  if (index !== -1) {
    favorites.splice(index, 1);
    saveFavorites();
  }
};

const createFavoriteElement = function ({ id, name }) {
  const li = document.createElement('li');
  li.classList.add('favorite-item');
  li.classList.add('justify-content-between');
  li.id = id;
  li.textContent = name;
  li.addEventListener('click', () => {
    const cityValue = li.textContent;
    getCityWeather(cityValue);
  });

  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-from-favorites');
  removeButton.classList.add('btn-close');
  removeButton.addEventListener('click', () => {
    removeFavorite(id);
    li.remove();
  });

  li.appendChild(removeButton);
  favoritesList.appendChild(li);
};

let lastId = 0;
const addToFavorites = function (event) {
  lastId++;
  const id = lastId;
  const name = city.innerText;

  const isFavorite = favorites.some(item => item.name === name);
  if (isFavorite) {
    return;
  }

  favorites.push({ id, name });
  createFavoriteElement({ id, name });
  saveFavorites();
};

addToFavoritesButton.addEventListener('click', addToFavorites);

const displayFavoritesList = function () {
  favorites.forEach(favorite => {
    createFavoriteElement(favorite);
  });
};

displayFavoritesList();
