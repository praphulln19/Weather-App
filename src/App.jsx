import { useState } from 'react'
import { WEATHER_API_BASE_URL, WEATHER_API_KEY } from './api'
import { Droplets, Wind, Thermometer, Eye, Gauge, Cloud } from 'lucide-react'

const getTheme = (conditionText) => {
  const lower = (conditionText || '').toLowerCase()

  if (lower.includes('clear') || lower.includes('sunny')) {
    return {
      bg: 'linear-gradient(160deg, #1a6fa8, #57b4e8)',
      buttonText: '#1a6fa8',
      badgeBg: 'rgba(255,255,255,0.25)',
    }
  }
  if (lower.includes('cloud')) {
    return {
      bg: 'linear-gradient(160deg, #4a5568, #718096)',
      buttonText: '#374151',
      badgeBg: 'rgba(255,255,255,0.22)',
    }
  }
  if (lower.includes('rain')) {
    return {
      bg: 'linear-gradient(160deg, #2d3748, #4a6fa5)',
      buttonText: '#1f4f8b',
      badgeBg: 'rgba(255,255,255,0.2)',
    }
  }
  if (lower.includes('drizzle')) {
    return {
      bg: 'linear-gradient(160deg, #2c5282, #4299e1)',
      buttonText: '#235a97',
      badgeBg: 'rgba(255,255,255,0.23)',
    }
  }
  if (lower.includes('thunder')) {
    return {
      bg: 'linear-gradient(160deg, #1a202c, #2d3748)',
      buttonText: '#111827',
      badgeBg: 'rgba(255,255,255,0.18)',
    }
  }
  if (lower.includes('snow')) {
    return {
      bg: 'linear-gradient(160deg, #7da2bf, #9ec7df)',
      buttonText: '#355e7c',
      badgeBg: 'rgba(255,255,255,0.32)',
    }
  }
  if (lower.includes('mist') || lower.includes('fog')) {
    return {
      bg: 'linear-gradient(160deg, #718096, #a0aec0)',
      buttonText: '#475569',
      badgeBg: 'rgba(255,255,255,0.24)',
    }
  }
  if (lower.includes('haze')) {
    return {
      bg: 'linear-gradient(160deg, #744210, #b7791f)',
      buttonText: '#7c4610',
      badgeBg: 'rgba(255,255,255,0.22)',
    }
  }

  return {
    bg: 'linear-gradient(160deg, #1a6fa8, #57b4e8)',
    buttonText: '#1a6fa8',
    badgeBg: 'rgba(255,255,255,0.25)',
  }
}

export default function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState(getTheme(''))

  const fetchWeather = async () => {
    if (!city.trim()) return
    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const res = await fetch(
        `${WEATHER_API_BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&days=1&aqi=no&alerts=no`
      )

      if (!res.ok) throw new Error('City not found. Please try again.')

      const data = await res.json()
      const day = data.forecast?.forecastday?.[0]?.day || {}
      const conditionIcon = data.current?.condition?.icon
      setTheme(getTheme(data.current.condition.text))

      setWeather({
        name: data.location.name,
        sys: { country: data.location.country },
        weather: [
          {
            main: data.current.condition.text,
            description: data.current.condition.text,
            icon: conditionIcon?.startsWith('//') ? `https:${conditionIcon}` : conditionIcon,
          },
        ],
        main: {
          temp: data.current.temp_c,
          temp_max: day.maxtemp_c,
          temp_min: day.mintemp_c,
          humidity: data.current.humidity,
          feels_like: data.current.feelslike_c,
          pressure: data.current.pressure_mb,
        },
        wind: { speed: data.current.wind_kph },
        visibility: (data.current.vis_km || 0) * 1000,
        clouds: { all: data.current.cloud },
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; }

        .app {
          min-height: 100vh;
          background: ${theme.bg};
          transition: background 1s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 16px;
          width: 100%;
          overflow-x: hidden;
        }

        .wrapper {
          width: 100%;
          max-width: 480px;
        }

        .title {
          text-align: center;
          font-size: clamp(1.6rem, 5vw, 2.2rem);
          font-weight: 700;
          color: white;
          margin-bottom: 28px;
          letter-spacing: -0.5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .title-logo {
          width: clamp(56px, 14vw, 80px);
          height: clamp(56px, 14vw, 80px);
          object-fit: contain;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
          animation: logoFloat 3s ease-in-out infinite;
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .title-text { display: flex; flex-direction: column; align-items: center; gap: 4px; }

        .title span { opacity: 0.85; font-weight: 400; font-size: 0.9em; display: block; margin-top: 4px; font-size: clamp(0.85rem, 3vw, 1rem); }

        .search-box {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
          width: 100%;
        }

        .search-input {
          flex: 1;
          padding: 14px 18px;
          border-radius: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.2);
          color: white;
          font-size: 1rem;
          outline: none;
          backdrop-filter: blur(8px);
          transition: border 0.2s;
        }

        .search-input::placeholder { color: rgba(255,255,255,0.65); }
        .search-input:focus { border-color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.25); }

        .search-btn {
          padding: 14px 22px;
          border-radius: 14px;
          border: none;
          background: rgba(255,255,255,0.9);
          color: ${theme.buttonText};
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: transform 0.15s, background 0.2s;
          white-space: nowrap;
        }

        .search-btn:hover { background: white; transform: scale(1.03); }
        .search-btn:active { transform: scale(0.98); }
        .search-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .error-msg {
          text-align: center;
          background: rgba(255,100,100,0.25);
          border: 1px solid rgba(255,100,100,0.4);
          color: white;
          padding: 12px 18px;
          border-radius: 12px;
          font-size: 0.95rem;
          margin-bottom: 16px;
        }

        .loader {
          text-align: center;
          color: rgba(255,255,255,0.85);
          font-size: 1rem;
          padding: 20px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 20px; height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .card {
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 24px;
          padding: 32px 28px;
          backdrop-filter: blur(12px);
          color: white;
          animation: fadeUp 0.4s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .city-name {
          font-size: clamp(1.4rem, 5vw, 1.8rem);
          font-weight: 700;
          line-height: 1.2;
        }

        .country-badge {
          background: ${theme.badgeBg};
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .weather-main {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 16px 0;
        }

        .temp {
          font-size: clamp(3rem, 12vw, 4.5rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -2px;
        }

        .icon-desc {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .icon-desc img { width: 60px; height: 60px; }

        .desc {
          font-size: 1rem;
          text-transform: capitalize;
          opacity: 0.9;
        }

        .divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.2);
          margin: 20px 0;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        @media (max-width: 640px) {
          .details-grid { grid-template-columns: repeat(2, 1fr); }
          .search-box { flex-direction: column; }
          .search-btn { width: 100%; }
        }

        @media (max-width: 420px) {
          .details-grid { grid-template-columns: 1fr; }
          .card { padding: 24px 16px; }
          .weather-main { flex-direction: column; }
        }

        .detail-item {
          background: rgba(255,255,255,0.12);
          border-radius: 14px;
          padding: 14px 10px;
          text-align: center;
        }

        .detail-icon { display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
        .detail-icon svg { width: 22px; height: 22px; stroke: rgba(255,255,255,0.9); stroke-width: 1.8; }
        .detail-label { font-size: 0.72rem; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .detail-value { font-size: 1rem; font-weight: 600; }

        .high-low {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 16px;
          font-size: 0.9rem;
          opacity: 0.85;
        }

        .high-low span { display: flex; align-items: center; gap: 4px; }
      `}</style>

      <div className="app">
        <div className="wrapper">
          <h1 className="title">
            <img src="/weather-app.png" alt="Weather App Logo" className="title-logo" />
            <span className="title-text">
              Weather App
              <span>Search any city in the world</span>
            </span>
          </h1>

          <div className="search-box">
            <input
              className="search-input"
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
            />
            <button className="search-btn" onClick={fetchWeather} disabled={loading}>
              {loading ? '...' : 'Search'}
            </button>
          </div>

          {error && <div className="error-msg">⚠ {error}</div>}

          {loading && (
            <div className="loader">
              <div className="spinner" />
              Fetching weather...
            </div>
          )}

          {weather && !loading && (
            <div className="card">
              <div className="card-header">
                <div className="city-name">{weather.name}</div>
                <div className="country-badge">{weather.sys.country}</div>
              </div>

              <div className="weather-main">
                <div className="temp">{Math.round(weather.main.temp)}°</div>
                <div className="icon-desc">
                  <img src={weather.weather[0].icon} alt="icon" />
                  <div className="desc">{weather.weather[0].description}</div>
                </div>
              </div>

              <div className="high-low">
                <span>↑ {Math.round(weather.main.temp_max)}°C</span>
                <span>↓ {Math.round(weather.main.temp_min)}°C</span>
              </div>

              <hr className="divider" />

              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-icon"><Droplets /></div>
                  <div className="detail-label">Humidity</div>
                  <div className="detail-value">{weather.main.humidity}%</div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon"><Wind /></div>
                  <div className="detail-label">Wind</div>
                  <div className="detail-value">{weather.wind.speed} kph</div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon"><Thermometer /></div>
                  <div className="detail-label">Feels like</div>
                  <div className="detail-value">{Math.round(weather.main.feels_like)}°C</div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon"><Eye /></div>
                  <div className="detail-label">Visibility</div>
                  <div className="detail-value">{(weather.visibility / 1000).toFixed(1)} km</div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon"><Gauge /></div>
                  <div className="detail-label">Pressure</div>
                  <div className="detail-value">{weather.main.pressure} hPa</div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon"><Cloud /></div>
                  <div className="detail-label">Clouds</div>
                  <div className="detail-value">{weather.clouds.all}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
