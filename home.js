// const apiKey = "5a9271e84840276c393f1e7fbf85e388"; 
// const city = "Manolo Fortich, Bukidnon, PH";


// async function fetchWithBackoff(url, options = {}, maxRetries = 5) {
//     let delay = 1000;
//     for (let i = 0; i < maxRetries; i++) {
//         try {
//             const response = await fetch(url, options);
//             if (response.ok) {
//                 return response;
//             } else if (response.status === 429) {
//                 console.log(`Rate limit exceeded. Retrying in ${delay}ms...`);
//             } else {
//                 console.error(`HTTP error! status: ${response.status}`, await response.text());
//                 // Throw an error with the HTTP status code
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//         } catch (error) {
//             console.error("Fetch attempt failed:", error);
//             if (i === maxRetries - 1) throw error;
//         }
//         await new Promise(resolve => setTimeout(resolve, delay));
//         delay *= 2;
//     }
//     throw new Error("Failed to fetch data after multiple retries.");
// }

// // Function to get icon URL from OpenWeatherMap icon code
// function getWeatherIconUrl(iconCode) {
//     return `https://openweathermap.org/img/wn/${iconCode}@4x.png`; 
// }

// // Function to capitalize first letter of a string
// function capitalizeFirstLetter(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
// }

// // Function to convert wind speed from m/s to km/h
// function msToKmH(ms) {
//     return (ms * 3.6).toFixed(0); // Round to whole number
// }

// async function fetchWeather() {
//     const weatherElement = document.getElementById('weather-data');
    
//     // OpenWeatherMap Current Weather API URL
//     const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

//     // Set Loading State
//     weatherElement.innerHTML = `
//         <div class="loading-container">
//             <div class="spinner"></div> 
//             <p>Loading real-time weather for ${city}...</p>
//         </div>
//     `;

//     try {
//         // Fetch Current Weather
//         const response = await fetchWithBackoff(apiUrl);
//         const data = await response.json();
        
//         // OpenWeatherMap returns a status code in 'cod' field. 401 means invalid key.
//         if (data.cod === '401') {
//              // Specific error for 401 Unauthorized/Invalid API Key
//              throw new Error("API Key Invalid. Please check if the key is correct and has been activated (may take a few hours).");
//         }
//         if (data.cod !== 200) {
//             console.error("OpenWeatherMap API Error:", data.message);
//             throw new Error(`API Error: ${data.message || 'City not found or unknown API issue.'}`);
//         }

//         // --- Data Extraction ---
//         const locationName = data.name;
//         const currentTemp = Math.round(data.main.temp);
//         const humidity = data.main.humidity;
//         const windSpeed = msToKmH(data.wind.speed);
//         const description = capitalizeFirstLetter(data.weather[0].description);
//         const iconCode = data.weather[0].icon;

//         // Air Quality: OpenWeatherMap free tier does not provide this (requires separate API call).
//         // We use a safe placeholder value based on general regional data (or 'N/A' if preferred).
//         const airQuality = 'Moderate'; 
        
//         // --- Render HTML ---
//         weatherElement.innerHTML = `
//             <div class="current-weather">
//                 <div class="weather-location">${locationName}, PH</div>
//                 <div class="weather-temp-icon">
//                     <img src="${getWeatherIconUrl(iconCode)}" alt="${description}" style="width: 100px; height: 100px;">
//                     <div class="weather-temp">${currentTemp}°C</div>
//                 </div>
//                 <div class="weather-description">${description}</div>

//                 <div class="weather-details-grid">
//                     <div class="detail-item-box">
//                         <div class="value">${humidity}%</div>
//                         <div class="label">Humidity</div>
//                     </div>
//                     <div class="detail-item-box">
//                         <div class="value">${windSpeed} km/h</div>
//                         <div class="label">Wind Speed</div>
//                     </div>
//                     <div class="detail-item-box">
//                         <div class="value">${airQuality}</div>
//                         <div class="label">Air Quality (Est.)</div>
//                     </div>
//                     <div class="detail-item-box">
//                         <div class="value">${Math.round(data.main.feels_like)}°C</div>
//                         <div class="label">Feels Like</div>
//                     </div>
//                 </div>
//             </div>
//         `;

//     } catch (error) {
//         // Display detailed error
//         console.error("Final weather fetch failed:", error);
//         weatherElement.innerHTML = `
//             <p style="color: red; font-weight: 600;">Error loading weather data.</p>
//             <p style="color: #555; font-size: 0.9em; margin-top: 0.5rem;">
//                 Reason: ${error.message}. Please check your API key status on the OpenWeatherMap dashboard.
//             </p>
//         `;
//     }
// }

// // Run the weather fetch function when the page loads
// window.onload = fetchWeather;



const apiKey = "5a9271e84840276c393f1e7fbf85e388"; 
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
        const airQuality = 'Moderate'; 
        
        // --- Render HTML ---
        weatherElement.innerHTML = `
            <div class="current-weather">
                <div class="weather-location">${locationName}, PH</div>
                <div class="weather-temp-icon">
                    <img src="${getWeatherIconUrl(iconCode)}" alt="${description}" style="width: 100px; height: 100px;">
                    <div class="weather-temp">${currentTemp}°C</div>
                </div>
                <div class="weather-description">${description}</div>

                <div class="weather-details-grid">
                    <div class="detail-item-box">
                        <div class="value">${humidity}%</div>
                        <div class="label">Humidity</div>
                    </div>
                    <div class="detail-item-box">
                        <div class="value">${windSpeed} km/h</div>
                        <div class="label">Wind Speed</div>
                    </div>
                    <div class="detail-item-box">
                        <div class="value">${airQuality}</div>
                        <div class="label">Air Quality (Est.)</div>
                    </div>
                    <div class="detail-item-box">
                        <div class="value">${Math.round(data.main.feels_like)}°C</div>
                        <div class="label">Feels Like</div>
                    </div>
                </div>
            </div>
        `;

    } catch (error) {
        // Display detailed error
        console.error("Final weather fetch failed:", error);
        weatherElement.innerHTML = `
            <p style="color: red; font-weight: 600;">Error loading weather data.</p>
            <p style="color: #555; font-size: 0.9em; margin-top: 0.5rem;">
                Reason: ${error.message}. Please check your API key status on the OpenWeatherMap dashboard.
            </p>
        `;
    }
}

// Run the weather fetch function when the page loads
window.onload = fetchWeather;