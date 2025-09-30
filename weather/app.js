const apiKey = "231ef8e7d421a49860e1bcf46941f8ae"; // Your OpenWeatherMap API key
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherContainer = document.getElementById("weatherContainer");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if(city) {
        weatherContainer.innerHTML = "Loading...";
        fetchWeather(city);
    } else {
        alert("Please enter a city name");
    }
});

async function fetchWeather(city) {
    try {
        // Current Weather
        const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if(!currentRes.ok) throw new Error("City not found");
        const currentData = await currentRes.json();

        const cityName = currentData.name;
        const country = currentData.sys.country;
        const temp = currentData.main.temp.toFixed(1);
        const weatherDesc = currentData.weather[0].description;
        const iconUrl = `http://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;
        const feelsLike = currentData.main.feels_like.toFixed(1);
        const humidity = currentData.main.humidity;
        const pressure = currentData.main.pressure;
        const windSpeed = currentData.wind.speed.toFixed(1);

        // 5-day forecast
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastRes.json();

        const dailyForecast = {};
        forecastData.list.forEach(entry => {
            const date = entry.dt_txt.split(" ")[0];
            if(!dailyForecast[date]) dailyForecast[date] = entry;
        });

        // Build HTML
        let html = `<div class="card">
            <h2>${cityName}, ${country}</h2>
            <img src="${iconUrl}" alt="weather icon">
            <div class="temp">${temp}°C</div>
            <div class="desc">${weatherDesc}</div>
            <div class="desc">Feels like: ${feelsLike}°C</div>
            <div class="desc">Humidity: ${humidity}%</div>
            <div class="desc">Pressure: ${pressure} hPa</div>
            <div class="desc">Wind: ${windSpeed} m/s</div>
        </div>`;

        html += `<div style="display:flex; flex-direction:column; align-items:center;">`;
        const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        for(let date in dailyForecast) {
            const entry = dailyForecast[date];
            const dt = new Date(entry.dt * 1000);
            const day = weekdays[dt.getDay()];
            const tempF = entry.main.temp.toFixed(1);
            const weatherF = entry.weather[0].description;
            const iconF = `http://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`;

            html += `<div class="card">
                <h2>${day}</h2>
                <img src="${iconF}" alt="icon">
                <div class="temp">${tempF}°C</div>
                <div class="desc">${weatherF}</div>
            </div>`;
        }
        html += `</div>`;
        weatherContainer.innerHTML = html;

    } catch (err) {
        weatherContainer.innerHTML = `<h2 style="color:red">City not found or API error!</h2>`;
    }
}
