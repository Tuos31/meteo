
const API_KEY = "cd8bfe4766c880e4b0410fed86ad31c0"; // ← remplace ici

const widget = document.getElementById("widget");

function updateTime() {
  const now = new Date();
  document.getElementById("time").textContent = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}
setInterval(updateTime, 1000);
updateTime();

function setTheme(condition) {
  const body = document.body;
  body.className = "";
  switch (condition.toLowerCase()) {
    case "clear":
      body.style.backgroundImage = "url('https://i.imgur.com/JR1rM9r.jpg')";
      widget.classList.add("light");
      break;
    case "rain":
    case "drizzle":
      body.style.backgroundImage = "url('https://i.imgur.com/cckfZlV.jpg')";
      widget.classList.remove("light");
      break;
    case "snow":
      body.style.backgroundImage = "url('https://i.imgur.com/jV2mvra.jpg')";
      widget.classList.add("light");
      break;
    case "clouds":
      body.style.backgroundImage = "url('https://i.imgur.com/hqlJLST.jpg')";
      widget.classList.remove("light");
      break;
    default:
      body.style.backgroundColor = "#2c3e50";
      widget.classList.remove("light");
  }
}

function loadWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const city = data.city.name;
      const today = data.list[0];
      const weatherMain = today.weather[0].main;
      setTheme(weatherMain);

      document.getElementById("location").textContent = city + " - " + new Date().toLocaleDateString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      document.getElementById("icon").src = `https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`;
      document.getElementById("temp").textContent = Math.round(today.main.temp) + "°C";
      document.getElementById("desc").textContent = today.weather[0].description;
      document.getElementById("feels").textContent = "Ressenti: " + Math.round(today.main.feels_like) + "°";
      document.getElementById("wind").textContent = "Vent: " + today.wind.speed + " m/s";
      document.getElementById("sun").textContent = "Lever: " + new Date(data.city.sunrise * 1000).toLocaleTimeString() + " | Coucher: " + new Date(data.city.sunset * 1000).toLocaleTimeString();

      const forecastContainer = document.getElementById("forecast");
      forecastContainer.innerHTML = "";

      for (let i = 8; i <= 8 * 5; i += 8) {
        const entry = data.list[i];
        const dayName = new Date(entry.dt * 1000).toLocaleDateString("fr-FR", { weekday: 'short' });
        forecastContainer.innerHTML += `
          <div class="day-forecast">
            <div>${dayName.toUpperCase()}</div>
            <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}.png">
            <div>${Math.round(entry.main.temp_max)}°/${Math.round(entry.main.temp_min)}°</div>
          </div>`;
      }
    });
}

function useGeolocationOrFallback() {
  navigator.geolocation.getCurrentPosition(
    pos => loadWeather(pos.coords.latitude, pos.coords.longitude),
    () => loadWeather(43.6045, 1.4442) // Toulouse
  );
}

useGeolocationOrFallback();
