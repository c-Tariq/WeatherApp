const apiKey = 'fbf2816d7731e9eefa643dfce73f26fc';

function getWeather() {
    const city = document.getElementById('city').value;

    if (city === '') {
        alert('Please enter a city');
        return;
    }

    const cwUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`; // current weather URL
    const theForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetchWeatherData(cwUrl, displayCurrentWeather);
    fetchWeatherData(theForecastUrl, displayHourlyForecast);
}

function fetchWeatherData(url, callback) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            callback(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        });
}

function displayCurrentWeather(data) {
    clearWeatherInfo();

    const weatherInfoDiv = document.getElementById('weather-info');
    const tempDiv = document.getElementById('temp-div');
    const weatherIcon = document.getElementById('weather-icon');

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const weatherDetails = data.weather[0].description;
        const imgCode = data.weather[0].icon;
        const imgUrl = `https://openweathermap.org/img/wn/${imgCode}@4x.png`;

        tempDiv.innerHTML = `<p>${temperature}°C</p>`;
        weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${weatherDetails}</p>`;
        weatherIcon.src = imgUrl;
        weatherIcon.alt = weatherDetails;

        weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
    }
}

function displayHourlyForecast(data) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = '';

    const upcoming24Hours = data.list.slice(0, 8); 

    upcoming24Hours.forEach(item => {
        const dateInterval = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateInterval.getHours();
        const temp = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const imgCode = item.weather[0].icon;
        const imgUrl = `https://openweathermap.org/img/wn/${imgCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${imgUrl}" alt="Hourly Weather Icon">
                <span>${temp}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function clearWeatherInfo() {
    const weatherInfoDiv = document.getElementById('weather-info');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const tempDiv = document.getElementById('temp-div');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDiv.innerHTML = '';
}
