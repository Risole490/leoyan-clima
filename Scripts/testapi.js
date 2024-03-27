const apiKEY = '563d3432cd1394d7ff15b978d9aa148e'
const apiCountryURL = 'https://flagcdn.com/16x12/ua.png'
const timeKEY = '174bbe7276ed4359a11f5024026858aa'

const cityInput = document.querySelector('#city-input')
const searchBtn = document.querySelector('#search')

const cityInfo = document.querySelector('#city-infos')


//Functions
function getWeatherData(city){

    if(!city){
        alert('Selecione uma cidade.')
        return;
    }

    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKEY}&lang=pt_br`
//  const forecastURL = `https://pro.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKEY}`

    fetch(currentWeatherURL)
        .then(response => response.json())
        .then(data => {
            displayWeather(data)
        })
        .catch(error => {
            console.error('Erro fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.')
        })
}

// function timeConverter(timestampUnix){
//     var a = new Date(timestampUnix*1000)
//     var months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
//     var year = a.getFullYear();
//     var month = months[a.getMonth()];
//     var date = a.getDate();
//     var hour = a.getHours();
//     var min = a.getMinutes();
//     var time = date + ' ' + month + ' ' + year + ' ' + hour + 'h' + min;
//     return time;
// }

function timeLocal(latitude, longitude){
    if(!latitude || !longitude){
        alert('Sem lat e long.')
        return;
    }

    const timeURL = `https://api.ipgeolocation.io/timezone?apiKey=${timeKEY}&lat=${latitude}&long=${longitude}`

    fetch(timeURL)
        .then(responseTime => responseTime.json())
        .then(dataTime => {
            console.log(dataTime)    
        })
        .catch(error => {
            console.error('Erro fetching current date:', error);
            alert('Error fetching current date. Please try again.')
        })


    // const dataCidadeFormatada = `${dia} ${mes} ${hora}:${minuto}`
    // return dataCidadeFormatada
}

function displayWeather(data){
    console.log(data)

    const cityName = data.name
    const cityCountry = data.sys.country
    const cityLong = data.coord.lon
    const cityLat = data.coord.lat

    const dataCidadeFormatada = timeLocal(cityLong, cityLat)
    // inserirInfosCidade(cityName, cityCountry, dataCidadeFormatada)



    // const climaDescricao = data.weather[0].description
    // const climaIcone = data.weather[0].icon
    // const cityTemperatura = parseInt(data.main.temp)
    // const citySensacao = parseInt(data.main.feels_like)
    // const cityPressao = data.main.pressure
    // const cityUmidade = data.main.humidity
    // const cityVisibilidade = data.visibility
    // const cityWindSpeed = parseInt(data.wind.speed)
    // const cityWindDirection = data.wind.deg
    // const citySunriseUnix = data.sys.sunrise
    // const citySunsetUnix = data.sys.sunset

    // var cityNascerDoSol = timeConverter(citySunriseUnix)
    // var cityPorDoSol = timeConverter(citySunsetUnix)
}

function inserirInfosCidade(cidade,pais,data){
    cityInfo.innerHTML = `
        <h1 class="city-name">${cidade}, ${pais}</h1>
        <div class="city-date-container">
            <h2 class="city-date">${data}</h2>
        </div>
    `
}

//Events
searchBtn.addEventListener("click", (e)=> {
    e.preventDefault();

    const city = cityInput.value

    getWeatherData(city)
})