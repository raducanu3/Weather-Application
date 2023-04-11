export const ICON_MAP = new Map();

const addIconMapping = function (values, icon) {
  values.forEach(value => {
    ICON_MAP.set(value, icon);
  });
};

addIconMapping(['01d'], 'day');
addIconMapping(['01n'], 'night');
addIconMapping(['02d'], 'cloudy-day-1');
addIconMapping(['02n'], 'cloudy-night-2');
addIconMapping(['03d', '03n', '04d', '04n', '50d', '50n'], 'cloudy');
addIconMapping(['09d', '09n'], 'rainy-6');
addIconMapping(['10d'], 'rainy-2');
addIconMapping(['10n'], 'rainy-5');
addIconMapping(['11d', '11n'], 'thunder');
addIconMapping(['13d', '13n'], 'snowy-5');
