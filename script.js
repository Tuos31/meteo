
const API_KEY = "cd8bfe4766c880e4b0410fed86ad31c0";

function setBackground(condition, sunrise, sunset) {
  const body = document.body;
  body.className = "";

  const now = Date.now() / 1000;
  const isDay = now > sunrise && now < sunset;

  if (isDay) {
    body.style.backgroundColor = "#e0f7fa";  // Bleu clair jour
  } else {
    body.style.backgroundColor = "#0d1b2a";  // Bleu foncé nuit
  }
}

function loadWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`;
  $.getJSON(url, function(data) {
    const city = data.city.name;
    const today = data.list[0];
    const iconCode = today.weather[0].icon;
    const description = today.weather[0].description;
    const temp = Math.round(today.main.temp);
    const feels = Math.round(today.main.feels_like);
    const wind = today.wind.speed;
    const sunrise = data.city.sunrise;
    const sunset = data.city.sunset;

    setBackground(today.weather[0].main.toLowerCase(), sunrise, sunset);

    $("#city").text(city);
    $("#icon").attr("src", `https://openweathermap.org/img/wn/${iconCode}@2x.png`);
    $("#temp").text(temp + "°C");
    $("#desc").text(description);
    $("#feels").text("Ressenti: " + feels + "°");
    $("#wind").text("Vent: " + wind + " m/s");
    $("#sun").text("Lever: " + new Date(sunrise * 1000).toLocaleTimeString() + " | Coucher: " + new Date(sunset * 1000).toLocaleTimeString());

    $("#forecast").empty();
    for (let i = 8; i <= 8 * 4; i += 8) {
      const entry = data.list[i];
      const day = new Date(entry.dt * 1000).toLocaleDateString("fr-FR", { weekday: 'short' });
      const icon = entry.weather[0].icon;
      const max = Math.round(entry.main.temp_max);
      const min = Math.round(entry.main.temp_min);
      $("#forecast").append(`
        <div class="day-forecast">
          <strong>${day}</strong><br>
          <img src="https://openweathermap.org/img/wn/${icon}.png"><br>
          ${max}° / ${min}°
        </div>
      `);
    }
  });
}

function useGeolocationOrFallback() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => loadWeather(pos.coords.latitude, pos.coords.longitude),
      () => loadWeather(43.6045, 1.4442)
    );
  } else {
    loadWeather(43.6045, 1.4442);
  }
}

$(document).ready(function() {
  useGeolocationOrFallback();
});
