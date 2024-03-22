const apiKEY = '563d3432cd1394d7ff15b978d9aa148e'
const apiCountryURL = 'https://flagcdn.com/16x12/ua.png'
const GeoURL = `http://api.openweathermap.org/geo/1.0/direct?q=Londres&limit=5&appid=${apiKEY}`

const cityInput = document.querySelector('#city-input')
const searchBtn = document.querySelector('#search')

const cityElement = document.querySelector('#city')
const tempElement = document.querySelector('#temperature span')
const descElement = document.querySelector('#description')
const weatherIconElement = document.querySelector('#weather-icon')
const countryElement = document.querySelector('#country')
const windElement = document.querySelector('#wind span')
const umidityElement = document.querySelector('#umidity span')


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

function timeConverter(timestampUnix){
    var a = new Date(timestampUnix*1000)
    var months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + 'h' + min;
    return time;
}

function displayWeather(data){
    console.log(data)

    const climaDescricao = data.weather[0].description
    const climaIcone = data.weather[0].icon
    console.log(climaDescricao)

    const cityTemperatura = parseInt(data.main.temp)
    const citySensacao = parseInt(data.main.feels_like)
    const cityPressao = data.main.pressure
    const cityUmidade = data.main.humidity
    const cityVisibilidade = data.visibility
    const cityWindSpeed = parseInt(data.wind.speed)
    const cityWindDirection = data.wind.deg
    const cityCountry = data.sys.country
    const citySunriseUnix = data.sys.sunrise
    const citySunsetUnix = data.sys.sunset

    var cityNascerDoSol = timeConverter(citySunriseUnix)
    var cityPorDoSol = timeConverter(citySunsetUnix)

    console.log(cityCountry, cityNascerDoSol, cityPorDoSol)

}

//Events
searchBtn.addEventListener("click", (e)=> {
    e.preventDefault();

    const city = cityInput.value

    getWeatherData(city)
})










// async function consultaLatLong(url){
//     const response = await fetch(url)
//     if(!response.ok){
//         throw new Error(`API call failed with status ${response.status}`)
//     }
//     const data = await response.json();
//     return data
// }

// let guardaCidade = []
// function selecionaResultados(data){
//     for(let i=0; i < data.length; i++){
//         guardaCidade.push(data[i].name)
//     }
// }



// consultaLatLong(GeoURL)
// .then (data => {
//     console.log(data)
//     selecionaResultados(data)
//     console.log(guardaCidade.length)
// })
// .catch(error => {
//     console.log(error)
// })
