  // --- JavaScript for Real-time Weather Integration ---

        // OpenWeatherMap API details
        const OWM_API_KEY = "06a9912b828ae26c5d0075a54ff0e699";
        const OWM_CITY_NAME = "Manolo Fortich, Bukidnon, PH"; // Target location

        // Helper function for exponential backoff (retry logic)
        async function fetchWithBackoff(func, maxRetries = 5) {
            let delay = 1000;
            for (let i = 0; i < maxRetries; i++) {
                try {
                    return await func();
                } catch (error) {
                    // Log error only if it's not the final attempt
                    if (i === maxRetries - 1) throw error; 
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                }
            }
        }

        /**
         * Fetches weather data directly from OpenWeatherMap.
         */
        async function fetchWeather() {
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${OWM_CITY_NAME}&units=metric&appid=${OWM_API_KEY}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        }

        /**
         * Renders the fetched weather data into the footer.
         * @param {object} data - OpenWeatherMap API response data.
         */
        function renderWeather(data) {
            const weatherDisplay = document.getElementById('weather-display');
            
            if (!data.main || !data.weather || data.weather.length === 0) {
                weatherDisplay.innerHTML = '<span style="color: var(--text-red-100);">Error: Data structure invalid.</span>';
                return;
            }

            const temp = Math.round(data.main.temp);
            const condition = data.weather[0].description;
            const mainCondition = data.weather[0].main.toLowerCase();

            // Determine a simple icon based on condition (using inline SVG for simplicity)
            let iconSvg = '';
            let iconClass = 'text-white'; // Default color

            if (mainCondition.includes('clear')) {
                // Sun Icon
                iconSvg = `<svg class="w-6 h-6 svg-yellow" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
            } else if (mainCondition.includes('cloud')) {
                // Cloud Icon
                iconSvg = `<svg class="w-6 h-6 svg-gray" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 014-4h2a4 4 0 115.905-.28L21 17.659V12a2 2 0 00-2-2h-3"></path></svg>`;
            } else if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) {
                // Rain Icon
                iconSvg = `<svg class="w-6 h-6 svg-blue" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v12h4v-12h-4z"></path></svg>`;
            } else {
                // Default Icon (Clock/Time)
                iconSvg = `<svg class="w-6 h-6" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
            }

            weatherDisplay.classList.remove('animate-pulse');
            weatherDisplay.innerHTML = `
                <span class="font-medium">${data.name}:</span>
                <span style="font-size: 1.125rem; font-weight: bold;">${temp}&#176;C</span>
                <div style="display: flex; align-items: center; gap: 0.25rem;">
                    ${iconSvg}
                    <span style="text-transform: capitalize;">${condition}</span>
                </div>
            `;
        }

        // Main execution function
        async function initWeather() {
            try {
                // Use backoff to handle transient API errors
                const weatherData = await fetchWithBackoff(fetchWeather);
                renderWeather(weatherData);
            } catch (error) {
                console.error("Failed to load weather data:", error);
                const weatherDisplay = document.getElementById('weather-display');
                weatherDisplay.classList.remove('animate-pulse');
                weatherDisplay.innerHTML = `
                    <span style="font-weight: 600; color: var(--text-red-100);">Weather Unavailable.</span>
                    <span style="font-size: 0.75rem; color: var(--text-red-200);">(API Check)</span>
                `;
            }
        }

        // Start fetching weather data when the window loads
        window.onload = initWeather;
        
        // Mobile Menu Toggler (simple example)
        document.getElementById('menu-button').addEventListener('click', () => {
            alert("Mobile Menu functionality would be implemented here, likely by toggling a navigation sidebar or dropdown.");
        });