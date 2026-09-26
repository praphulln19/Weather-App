<p align="center">
  <img src="public/weather-app.png" alt="Weather App Logo" width="100" />
</p>

# 🌤️ Weather App

A responsive weather dashboard built with React and Vite that provides current weather information for any city using the WeatherAPI service.

## ✨ Features

- 🔎 Search weather by city name
- 🌡️ Display current temperature, condition, daily high and low, and country
- 💧 Show humidity, wind speed, visibility, pressure, cloud coverage, and feels-like temperature
- ⏳ Provide loading and error states for API requests
- 🎨 Apply weather-based visual themes for different conditions
- 📱 Support responsive layouts for desktop and mobile screens

## 🛠️ Technology Stack

- ⚛️ **React** - Frontend UI development
- 🟨 **JavaScript** - Application logic
- ⚡ **Vite** - Development server and build tool
- 🎨 **CSS** - Styling and responsive design
- 🌐 **WeatherAPI** - Weather data and REST API

## 📋 Prerequisites

- Node.js 18 or later
- A WeatherAPI API key

## 🚀 Installation

1. Clone or download the repository.
2. Open a terminal in the project directory.
3. Install the dependencies:

```bash
npm install

npm run dev      # Start the development server
npm run build    # Create a production build
npm run preview  # Preview the production build
npm run lint     # Run ESLint


Weather App/
├── public/               # Public static files
├── src/
│   ├── assets/           # Application assets
│   ├── api.js            # WeatherAPI configuration and requests
│   ├── App.css           # Weather dashboard styles
│   ├── App.jsx           # Main weather dashboard component
│   ├── index.css         # Global styles
│   └── main.jsx          # React application entry point
├── .gitignore             # Git ignore rules
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML entry point
├── package.json            # Project metadata and scripts
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation