import React, { useState } from "react";
import "./WeatherApp.css";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const API_KEY = "d26e0f689466401e8888270e5100adcf";

  const getWeather = async () => {
    if (!city.trim()) {
      setErrorMsg("Please enter a city name.");
      setWeather(null);
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const data = await res.json();

      if (data.cod === 200) {
        setWeather(data);
        setErrorMsg("");
      } else {
        setWeather(null);
        setErrorMsg(data.message || "City not found.");
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      setErrorMsg("Something went wrong. Please try again.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getWeather();
    }
  };

  const getWeatherIcon = () => {
    if (!weather) return "⛅";
    const main = weather.weather?.[0]?.main?.toLowerCase() || "";

    if (main.includes("cloud")) return "☁️";
    if (main.includes("rain")) return "🌧️";
    if (main.includes("thunder")) return "⛈️";
    if (main.includes("drizzle")) return "🌦️";
    if (main.includes("snow")) return "❄️";
    if (main.includes("clear")) return "☀️";
    if (main.includes("mist") || main.includes("fog")) return "🌫️";

    return "🌍";
  };

  return (
    <div className="weather-app">
      <div className="weather-card">
        <header className="weather-header">
          <div className="weather-logo">
            <span className="logo-icon">🌤️</span>
            <span className="logo-text">WeatherNow</span>
          </div>
          <p className="header-subtitle">Get live weather of any city instantly.</p>
        </header>

        <div className="weather-search">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search city (e.g. Delhi, London)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button
            className="search-button"
            onClick={getWeather}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>

        {errorMsg && <div className="error-message">{errorMsg}</div>}

        {!weather && !errorMsg && !isLoading && (
          <div className="weather-placeholder">
            <p>Type a city name and hit Search to view weather details.</p>
          </div>
        )}

        {weather && (
          <div className="weather-content">
            <div className="weather-main">
              <div className="weather-icon">{getWeatherIcon()}</div>
              <div>
                <h1 className="weather-city">{weather.name}</h1>
                <p className="weather-description">
                  {weather.weather?.[0]?.description
                    ?.replace(/\b\w/g, (c) => c.toUpperCase()) || ""}
                </p>
              </div>
            </div>

            <div className="weather-temp-block">
              <span className="temp-value">
                {Math.round(weather.main.temp)}°C
              </span>
              <span className="feels-like">
                Feels like {Math.round(weather.main.feels_like)}°C
              </span>
            </div>

            <div className="weather-stats">
              <div className="stat-item">
                <span className="stat-label">Humidity</span>
                <span className="stat-value">{weather.main.humidity}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Wind</span>
                <span className="stat-value">{weather.wind.speed} m/s</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Pressure</span>
                <span className="stat-value">{weather.main.pressure} hPa</span>
              </div>
            </div>
          </div>
        )}

        <footer className="weather-footer">
          <span>Data by OpenWeatherMap • Built with React</span>
        </footer>
      </div>
    </div>
  );
};

export default WeatherApp;
