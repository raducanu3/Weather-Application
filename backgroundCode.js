export const BACKGROUND_MAP = new Map();

const addBackgroundMapping = function (values, icon) {
  values.forEach(value => {
    BACKGROUND_MAP.set(value, icon);
  });
};

addBackgroundMapping(['01d', '11d'], 'clear-sky');
addBackgroundMapping(['02d'], 'cloudy');
addBackgroundMapping(['03d', '04d'], 'scattered-clouds');
addBackgroundMapping(['09d', '10d'], 'rainy');
addBackgroundMapping(['01n', '11n'], 'clear-night');
addBackgroundMapping(['03n', '02n', '04n'], 'cloudy-night');
addBackgroundMapping(['09n', '10n'], 'rain-night');
addBackgroundMapping(['13d'], 'snow-day');
addBackgroundMapping(['13n'], 'snow-night');
addBackgroundMapping(['50d'], 'mist-day');
addBackgroundMapping(['50n'], 'mist-night');
