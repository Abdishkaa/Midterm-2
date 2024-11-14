const apiKey = 'b3cbd0cd602a1893e67150d14c1a7a7c';
let unit = 'metric'; 
let city = '';


function getWeather() {
    city = document.getElementById('city').value;

    if (!city) {
        alert('Enter a city');
        return;
    }

    fetchCurrentWeather();
    fetchForecast();
}


function toggleUnit() {
    unit = document.getElementById('unit-toggle').checked ? 'imperial' : 'metric';
    if (city) {
        fetchCurrentWeather();
        fetchForecast();
    }
}


function fetchCurrentWeather() {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => {
            console.error('Error with fetching  weather data:', error);
            alert('Error with  weather data. Please try again.');
        });
}


function fetchForecast() {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayForecast(data.list))
        .catch(error => {
            console.error('Error with fetching forecast data:', error);
            alert('Error with fetching forecast data. Please try again.');
        });
}


function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const humidityWindDiv = document.getElementById('humidity-wind');
    const weatherIcon = document.getElementById('weather-icon');

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        weatherIcon.alt = description;

        tempDivInfo.innerHTML = `<p>${temperature}°${unit === 'metric' ? 'C' : 'F'}</p>`;
        weatherInfoDiv.innerHTML = `<p>${cityName} - ${description}</p>`;
        humidityWindDiv.innerHTML = `<p>Humidity: ${humidity}% | Wind: ${windSpeed} ${unit === 'metric' ? 'm/s' : 'mph'}</p>`;
        weatherIcon.style.display = 'block';
    }
}


function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';


    const dailyData = data.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString(undefined, { weekday: 'short' });
        const maxTemp = Math.round(item.main.temp_max);
        const minTemp = Math.round(item.main.temp_min);
        const iconCode = item.weather[0].icon;
        const description = item.weather[0].description;

        forecastDiv.innerHTML += `
            <div class="forecast-item">
                <p>${day}</p>
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}">
                <p>${maxTemp}° / ${minTemp}°</p>
                <p>${description}</p>
            </div>
        `;
    });
}


function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const locationWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
            const locationForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;

            fetch(locationWeatherUrl)
                .then(response => response.json())
                .then(data => displayWeather(data));

            fetch(locationForecastUrl)
                .then(response => response.json())
                .then(data => displayForecast(data.list));
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
}




function selectCity(cityName) {
    document.getElementById('city').value = cityName;
    document.getElementById('suggestions').innerHTML = '';
    getWeather();
}
