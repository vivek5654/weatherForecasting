let cityInput = document.querySelector('.input-city');
let searchBtn = document.querySelector('.search-button');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const weatherInfoSection = document.querySelector('.weather-info');

const countryText = document.querySelector('.country-text');
const tempText = document.querySelector('.temp-text');
const conditionText = document.querySelector('.condition-text');
const humidityText = document.querySelector('.humidity-value');
const windText = document.querySelector('.wind-value');
const weatherIcon = document.querySelector('.weather-summary-image');
const currentDate = document.querySelector('.current-date-text');


const forecastContainer = document.querySelector('.forecast-item-ontainer');

const apiKey = 'ee309a5d93d85cdd9e41a2aba9a10195';
searchBtn.addEventListener('click', () => {
    if( cityInput.value.trim() != "" ) {
        updateWeatherInfo(cityInput.value)
        cityInput.value = "";
        cityInput.blur();
    }

})
cityInput.addEventListener('keydown',(event) => {
    if(event.key == "Enter" && cityInput.value.trim() != "") {
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
        cityInput.blur();
    }
})

async function getfetchData(endPoint, city)  {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl)
    return response.json();
}

function getWeatherIcon(id) {
    if(id <= 232) return "thunderstorm.svg";
    if(id <= 321) return "drizzle.svg";
    if(id <= 531) return "rain. svg";
    if(id <= 622) return "snow.svg";
    if(id <= 781) return "atmosphere. svg";
    if(id <= 800) return "clear.svg";
    else return "clouds.svg";
}




async function updateWeatherInfo(city) {
    const weatherData = await getfetchData('weather',city); 
    if(weatherData.cod !== 200) {
        showDisplaySection(notFoundSection)
        return
    }
    console.log(weatherData)

    const {
        name : country,
        main : {temp, humidity},
        weather : [{id, main}],
        wind : {speed}

    } = weatherData

    countryText.textContent = country;
    tempText.textContent = Math.round(temp) + "°C";
    conditionText.textContent = main;
    humidityText.textContent = humidity + "%";
    windText.textContent = Math.round(speed) + "km/h";
    weatherIcon.src = `./assets/assets/weather/${getWeatherIcon(id)}`;
    currentDate.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
    });




    await updateForecastaInfo(city)
    showDisplaySection(weatherInfoSection)

}
async function updateForecastaInfo(city) {
    const forecastsDate = await getfetchData('forecast', city);
    const timeTaken = '12:00:00';
    const todaydate = new Date().toISOString().split('T')[0];
    forecastContainer.innerHTML = '';

    forecastsDate.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todaydate)) {
        updateForecastItems(forecastWeather)
        }
    })

}
function updateForecastItems(weatherData) {
    const {
        dt_txt : date,
        main : {temp},
        weather : [{id}],
    } = weatherData

    const dateTaken = new Date(date)
    const dateOpiton = {
        day : '2-digit',
        month : 'short',
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOpiton)

    const forecastItem = `
        <div class="foreccast-item">
            <h5 class="forecast-item-date regular-text">${dateResult}</h5>
            <img src="./assets/assets/weather/${getWeatherIcon(id)}" alt="Weather Image" class="forecast-item-image"/>
            <h5 class="forecast-item-condition">${Math.round(temp)} ℃</h5>
         </div>
    `
    forecastContainer.insertAdjacentHTML('beforeend', forecastItem);


}
function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection].forEach (section => section.style.display = 'none');
    section.style.display = '';
}