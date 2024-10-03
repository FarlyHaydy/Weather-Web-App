let cityInput = document.getElementById('city_input'),
    searchBtn = document.getElementById('searchBtn'),
    locationBtn = document.getElementById('locationBtn'),
    whatsappBtn = document.getElementById('whatsappBtn'), 
    api_key = 'c3b367f51bf3b3bf4dfb7533c353aaaf',
    currentWeatherCard = document.querySelectorAll('.weather-left .card')[0],
    fiveDaysForecastCard = document.querySelector('.day-forecast'),
    aqicard = document.querySelectorAll('.highlights .card')[0],
    sunrisecard = document.querySelectorAll('.highlights .card')[1],
    HumidityVal = document.getElementById('humidityVal'),
    PressureVal = document.getElementById('pressureVal'),
    VisibilityVal = document.getElementById('VisibilityVal'),
    WindSpeedVal = document.getElementById('WindSpeedVal'),
    FeelsVal = document.getElementById('feelVal'),
    hourlyForecastCard = document.querySelector('.hourly-forecast'),
    aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

function getWeatherDetails(lat, lon, name, country, state) {
    let FORECAST_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
        WEATHER_API = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
        AIR_POLLUTION_API = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    fetch(AIR_POLLUTION_API).then(res => res.json()).then(data => {
        let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
        aqicard.innerHTML = `
            <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
            </div>
            <div class="air-indices">
                <i class="fa-regular fa-wind fa-3x"></i>
                <div class="item">
                    <p>PM2.5</p>
                    <h2>${pm2_5}</h2>
                </div>
                <div class="item">
                    <p>PM10</p>
                    <h2>${pm10}</h2>
                </div>
                <div class="item">
                    <p>SO2</p>
                    <h2>${so2}</h2>
                </div>
                <div class="item">
                    <p>CO</p>
                    <h2>${co}</h2>
                </div>
                <div class="item">
                    <p>NO</p>
                    <h2>${no}</h2>
                </div>
                <div class="item">
                    <p>NO2</p>
                    <h2>${no2}</h2>
                </div>
                <div class="item">
                    <p>NH3</p>
                    <h2>${nh3}</h2>
                </div>
                <div class="item">
                    <p>O2</p>
                    <h2>${o3}</h2>
                </div>
            </div>
        `;
    }).catch(() => {
        alert('failed to fetch air pollution details');
    });
    
    fetch(WEATHER_API).then(res => res.json()).then(data => {
        let date = new Date();
        currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class="fa-light fa-calendar"></i>${days[date.getDay()]}, ${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}</p>
                <p><i class="fa-light fa-location-dot"></i>${name},  ${country}</p>
            </div>
        `;
    
        let {sunrise, sunset} = data.sys,
            {timezone, visibility} = data,
            {feels_like, humidity, pressure} = data.main,
            {speed} = data.wind,
            sRiseTime = moment.utc(sunrise, 'x').add(timezone, 'seconds').format('hh:mm A'),
            sSetTime = moment.utc(sunset, 'x').add(timezone, 'seconds').format('hh:mm A');

        document.getElementById('feelVal').innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
        document.getElementById('VisibilityVal').innerHTML = `${(visibility / 1000).toFixed(1)} km`;
        document.getElementById('WindSpeedVal').innerHTML = `${(speed * 3.6).toFixed(1)} km/h`; 
    
        sunrisecard.innerHTML = `
            <div class="card-head">
                <p>Sunrise & Sunset</p>
            </div>
            <div class="sunrise-sunset">
                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunrise fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunrise</p>
                        <h2>${sRiseTime}</h2>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunset fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunset</p>
                        <h2>${sSetTime}</h2>
                    </div>
                </div>
            </div>
        `;
    
        HumidityVal.innerHTML = `${humidity}%`;
        PressureVal.innerHTML = `${pressure} hPa`;
        VisibilityVal.innerHTML = `${(visibility / 1000).toFixed(1)} Km`;
        WindSpeedVal.innerHTML = `${(speed * 3.6).toFixed(1)} km/h`; 
        FeelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
    }).catch(() => {
        alert('Failed to fetch weather details');
    });
    
    fetch(FORECAST_API).then(res => res.json()).then(data => {
        let hourForecast = data.list;
        hourlyForecastCard.innerHTML = '';
        for (let i = 0; i <= 7; i++) {
            let hrForecastDate = new Date(hourForecast[i].dt_txt);
            let hr = hrForecastDate.getHours();
            let a = "PM";
            if (hr < 12) a = "AM";
            if (hr == 0) hr = 12;
            if (hr > 12) hr = hr - 12;
            hourlyForecastCard.innerHTML += `
            <div class="card">
                <p>${hr} ${a}</p>
                <img src="https://openweathermap.org/img/wn/${hourForecast[i].weather[0].icon}@2x.png" alt="">
                <p>${(hourForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
            </div>
            `;
        }
    
        let uniqueForecastDays = [];
        let fiveDaysForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                uniqueForecastDays.push(forecastDate);
                return forecast;
            }
        });
    
        fiveDaysForecastCard.innerHTML = '';
        for (let i = 0; i < fiveDaysForecast.length; i++) {
            let date = new Date(fiveDaysForecast[i].dt_txt);
            fiveDaysForecastCard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}@2x.png" alt="">
                        <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                    </div>
                    <p>${date.getDate()} ${month[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
            `;
        }
    }).catch(() => {
        alert('Failed to fetch weather forecast');
    });    
}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if(!cityName) return;
    let GEOCODING_API = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

    fetch(GEOCODING_API).then(res => res.json()).then(data => {
        let {name, lat, lon, country, state} = data[0];
        getWeatherDetails(lat, lon, name, country, state);
    }).catch(() => {
        alert(`Failed to fetch coordinates of ${cityName}`);
    });
}

function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude, longitude} = position.coords;
        let REVERSE_GEOCODING = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

        fetch(REVERSE_GEOCODING).then(res => res.json()).then(data => {
            let {name, country, state} = data[0];
            getWeatherDetails(name, latitude, longitude, country, state)
        }).catch(() => {
            alert('Failed to fetch coordinates');
        });
    });
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);

function showWhatsAppAlert() {
    alert('Jika menemukan Bug tolong hubungi nomor berikut : +62-888-8888888');
}
