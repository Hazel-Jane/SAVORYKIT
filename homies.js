const apiKey = "d5d896b1236b92d4be31e4bc08be118c";
let city = "Manolo Fortich, Bukidnon, PH"; 


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
    // meters/second to kilometers/hour
    return (ms * 3.6).toFixed(0);
}

function getDayName(offset) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return days[date.getDay()];
}

function getFormattedDate(date = new Date()) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).replace(/,/g, '');
}

// Function to determine mock forecast icon 
function getMockForecastData(currentTemp, offset) {
    // Mocking a slight temperature variation for forecast
    let tempDiff = 0;
    let iconClass = 'bxs-sun';
    
    // Simple weather shift mock (since we only have current data)
    switch (offset) {
        case 1: // Next Day 
            tempDiff = -4; 
            iconClass = 'bxs-cloud';
            break;
        case 2: // Day after 
            tempDiff = -8;
            iconClass = 'bxs-cloud-rain';
            break;
        case 3: // Third Day 
            tempDiff = -2;
            iconClass = 'bxs-sun-cloud';
            break;
        default:
            tempDiff = 0;
            iconClass = 'bxs-sun';
    }

    return {
        temp: Math.round(currentTemp + tempDiff),
        icon: iconClass
    };
}

// --- MAIN FUNCTIONS ---

async function fetchWeather(searchCity = city) {
    const weatherElement = document.getElementById('weather-data');
    
    // Ensure the new class is applied
    weatherElement.className = "weather-info-container weather-card-v3"; 
    
    const cityToFetch = searchCity;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityToFetch}&appid=${apiKey}&units=metric`;

    // Set Loading State WITH the Search Bar Structure (for immediate display)
    weatherElement.innerHTML = `
        <div class="current-weather-v3">
            <div>
                <div class="weather-day-v3">${getDayName(0)}</div>
                <div class="weather-date-v3">${getFormattedDate()}</div>
                <div class="weather-location-v3"> <i class='bx bxs-map'></i> ${cityToFetch}</div>
            </div>
            
            <div class="weather-main-info">
                <i class='bx bxs-sun weather-icon-v3'></i> 
                <div class="weather-temp-v3">--°C</div>
                <div class="weather-description-v3">Loading...</div>
            </div>
            
            <div class="weather-search-v3">
                <div class="search-input-container">
                    <input type="text" id="city-search-input" placeholder="Search City, e.g., London" value="${cityToFetch}">
                    <button id="search-button" aria-label="Search City">
                        <i class='bx bx-search-alt-2'></i> 
                    </button>
                </div>
            </div>
        </div>
        <div class="weather-details-forecast-v3">
            <p style="text-align: center;">Fetching weather data...</p>
        </div>
    `;
    
    // Attach listeners immediately to the loading state search bar
    attachSearchListeners(); 

    try {
        const response = await fetchWithBackoff(apiUrl);
        const data = await response.json();

        // ... (API error checks remain the same) ...
        if (data.cod === '401') {
            throw new Error("API Key Invalid. Please check the key.");
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
        
        city = locationName; 

        const forecastDay1 = getMockForecastData(currentTemp, 1);
        const forecastDay2 = getMockForecastData(currentTemp, 2);
        const forecastDay3 = getMockForecastData(currentTemp, 3);
        weatherElement.innerHTML = `
            <div class="current-weather-v3">
                <div>
                    <div class="weather-day-v3">${getDayName(0)}</div>
                    <div class="weather-date-v3">${getFormattedDate()}</div>
                    <div class="weather-location-v3"> <i class='bx bxs-map'></i> ${locationName}, ${data.sys.country}</div>
                </div>

                <div class="weather-main-info">
                    <img src="${getWeatherIconUrl(iconCode)}" alt="${description}" class="weather-icon-v3">
                    <div class="weather-temp-v3">${currentTemp}°C</div>
                    <div class="weather-description-v3">${description}</div>
                </div>

                <div class="weather-search-v3">
                    <div class="search-input-container">
                        <input type="text" id="city-search-input" placeholder="Search City, e.g., London" value="${locationName}">
                        <button id="search-button" aria-label="Search City">
                            <i class='bx bx-search-alt-2'></i> 
                        </button>
                    </div>
                </div>
            </div>

            <div class="weather-details-forecast-v3">
                
                <div class="details-grid-v3">
                    <div class="detail-label-v3">Precipitation</div>
                    <div class="detail-value-v3">0%</div>

                    <div class="detail-label-v3">Humidity</div>
                    <div class="detail-value-v3">${humidity}%</div>
                    
                    <div class="detail-label-v3">Wind</div>
                    <div class="detail-value-v3">${windSpeed} km/h</div>
                </div>

                <div class="weather-forecast-v3">
                    <div class="forecast-day-v3 active">
                        <i class='bx bxs-sun forecast-icon-v3'></i>
                        <div class="forecast-day-name-v3">${getDayName(0)}</div>
                        <div class="forecast-temp-v3">${currentTemp}°C</div>
                    </div>
                    
                    <div class="forecast-day-v3">
                        <i class='bx ${forecastDay1.icon} forecast-icon-v3'></i>
                        <div class="forecast-day-name-v3">${getDayName(1)}</div>
                        <div class="forecast-temp-v3">${forecastDay1.temp}°C</div>
                    </div>

                    <div class="forecast-day-v3">
                        <i class='bx ${forecastDay2.icon} forecast-icon-v3'></i>
                        <div class="forecast-day-name-v3">${getDayName(2)}</div>
                        <div class="forecast-temp-v3">${forecastDay2.temp}°C</div>
                    </div>

                    <div class="forecast-day-v3">
                        <i class='bx ${forecastDay3.icon} forecast-icon-v3'></i>
                        <div class="forecast-day-name-v3">${getDayName(3)}</div>
                        <div class="forecast-temp-v3">${forecastDay3.temp}°C</div>
                    </div>
                </div>
            </div>
        `;
        attachSearchListeners();

    } catch (error) {
        console.error("Final weather fetch failed:", error);
        const searchContainer = weatherElement.querySelector('.weather-search-v3') || '';
        const errorHtml = `
            <p style="color: red; font-weight: 600; padding: 20px;">Error loading weather data.</p>
            <p style="color: darkred; font-size: 1rem; padding: 0 20px 20px;">
                Reason: ${error.message}. Please try a different city.
            </p>
            <div class="weather-search-v3">
                <div class="search-input-container">
                    <input type="text" id="city-search-input" placeholder="Search City, e.g., London" value="${cityToFetch}">
                    <button id="search-button" aria-label="Search City">
                        <i class='bx bx-search-alt-2'></i> 
                    </button>
                </div>
            </div>
        `;
        weatherElement.innerHTML = `
            <div class="current-weather-v3">
                <div style="margin: auto; text-align: center;">${errorHtml}</div>
            </div>
            <div class="weather-details-forecast-v3">
                <p style="text-align: center; color: var(--dark-panel-subtext);">Details unavailable.</p>
            </div>
        `;
        attachSearchListeners();
    }
}

function handleSearch() {
    const searchInput = document.getElementById('city-search-input');
    const newCity = searchInput ? searchInput.value.trim() : '';

    if (newCity) {
        fetchWeather(newCity);
    } else {
        alert("Please enter a city name to search!");
    }
}

function attachSearchListeners() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('city-search-input');
    if (searchButton) {
        searchButton.removeEventListener('click', handleSearch); 
        searchButton.addEventListener('click', handleSearch);
    }
    
    if (searchInput) {
        searchInput.removeEventListener('keypress', handleSearchOnEnter); 
        searchInput.addEventListener('keypress', handleSearchOnEnter);
    }
}

function handleSearchOnEnter(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        handleSearch();
    }
}

// Initial call to set up the card and fetch data
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('weather-data')) {
        fetchWeather();
    }
});

// Initial call to set up the card and fetch data
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('weather-data')) {
        fetchWeather();
    }
});