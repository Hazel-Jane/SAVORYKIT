const apiKey = "d5d896b1236b92d4be31e4bc08be118c";
const city = "Manolo Fortich, Bukidnon, PH";


async function fetchWithBackoff(url, options = {}, maxRetries = 5) {
    let delay = 1000;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return response;
            } else if (response.status === 429) {
                console.log(`Rate limit exceeded. Retrying in ${delay}ms...`);
            } else {
                console.error(`HTTP error! status: ${response.status}`, await response.text());
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error("Fetch attempt failed:", error);
            if (i === maxRetries - 1) throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
    }
    throw new Error("Failed to fetch data after multiple retries.");
}

function getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function msToKmH(ms) {
    return (ms * 3.6).toFixed(0);
}

function getDayName(offset) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return days[date.getDay()];
}

function getFormattedDate() {
    const date = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).replace(/,/g, '');
}

async function fetchWeather() {
    const weatherElement = document.getElementById('weather-data');
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    // Set Loading State
    weatherElement.innerHTML = `
 <div class="loading-container">
 <div class="spinner"></div> 
 <p>Loading real-time weather for ${city}...</p>
 </div>
 `;

    try {
        const response = await fetchWithBackoff(apiUrl);
        const data = await response.json();

        if (data.cod === '401') {
            throw new Error("API Key Invalid. Please check if the key is correct and has been activated (may take a few hours).");
        }
        if (data.cod !== 200) {
            console.error("OpenWeatherMap API Error:", data.message);
            throw new Error(`API Error: ${data.message || 'City not found or unknown API issue.'}`);
        }

        // --- Data Extraction ---
        const locationName = data.name;
        const currentTemp = Math.round(data.main.temp);
        const humidity = data.main.humidity;
        const windSpeed = msToKmH(data.wind.speed);
        const description = capitalizeFirstLetter(data.weather[0].description);
        const iconCode = data.weather[0].icon;
        const pressure = data.main.pressure;
        const feelsLike = Math.round(data.main.feels_like);
        const todayDay = getDayName(0);
        const formattedDate = getFormattedDate();

        // --- Render HTML (Matching Split-Box Design) ---
        weatherElement.innerHTML = `
                            <div class="current-weather">
                            <div class="weather-date">${todayDay}</div>
                            <div class="weather-time">${formattedDate}</div>
                            <div class="weather-location"> <i class='bx bxs-map'></i> ${locationName}, PH</div>
                            
                            <div class="weather-temp-icon">
                            <img src="${getWeatherIconUrl(iconCode)}" alt="${description}">
                            <div class="weather-temp">${currentTemp}°C</div>
                            </div>

                            </div>

                            <div class="weather-details-panel">
                            <div class="detail-row">
                            <span class="detail-label">Humidity</span>
                            <span class="detail-value">${humidity}%</span>
                            </div>
                            <div class="detail-row">
                            <span class="detail-label">Wind</span>
                            <span class="detail-value">${windSpeed} km/h</span>
                            </div>
                            <div class="detail-row">
                            <span class="detail-label">Feels Like</span>
                            <span class="detail-value">${feelsLike}°C</span>
                            </div>
                            <div class="detail-row">
                            <span class="detail-label">Pressure</span>
                            <span class="detail-value">${pressure} hPa</span>
                            </div>

                            <div class="weather-forecast-placeholder">
                            <div class="forecast-item">
                            <i class='bx bxs-sun forecast-icon' style="color: gold;"></i>
                            <div class="forecast-day">${todayDay}</div>
                            <div class="forecast-temp">${currentTemp}°C</div>
                            </div>
                            <div class="forecast-item">
                            <i class='bx bxs-cloud forecast-icon'></i>
                            <div class="forecast-day">${getDayName(1)}</div>
                            <div class="forecast-temp">${Math.round(currentTemp - 4)}°C</div>
                            </div>
                            <div class="forecast-item">
                            <i class='bx bxs-cloud-rain forecast-icon'></i>
                            <div class="forecast-day">${getDayName(2)}</div>
                            <div class="forecast-temp">${Math.round(currentTemp - 8)}°C</div>
                            </div>
                            </div>

                            </div>
                            `;

    } catch (error) {
        // Display detailed error
        console.error("Final weather fetch failed:", error);
        weatherElement.innerHTML = `
 <p style="color: ${error.message.includes('API Key Invalid') ? 'red' : 'inherit'}; font-weight: 600;">Error loading weather data.</p>
 <p style="color: ${error.message.includes('API Key Invalid') ? 'darkred' : 'inherit'}; font-size: 5em; margin-top: 0.5rem;">
 Reason: ${error.message}.
 </p>
 `;
    }
}

// Run the weather fetch function when the page loads
window.onload = fetchWeather;