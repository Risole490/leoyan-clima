const apiKEY = '563d3432cd1394d7ff15b978d9aa148e'
const timeKEY = '174bbe7276ed4359a11f5024026858aa'

const cityInput = document.querySelector('#city-input')
const searchBtn = document.querySelector('#search')

const cityInfos = document.querySelector('#city-infos-container')


//Functions
async function getWeatherData(city){
    let cidadeNome
    let cidadePais
    let iconeClima

    if(!city){
        alert('Selecione uma cidade.')
        return;
    }

    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKEY}&lang=pt_br`

    try{ 
        const response = await fetch(currentWeatherURL)
        const data = await response.json()
        console.log(data)
        cidadeNome = data.name
        cidadePais = data.sys.country
        iconeClima = data.weather[0].icon
        }
     catch(error) {
            console.error('Erro fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.')
        }

    const horarioCidadeFormatado = await timeLocal(cidadeNome)
    const cidadeIconeClima = await getIconeClima(iconeClima)
    console.log(cidadeIconeClima)
    
    displayWeather(cidadeNome,cidadePais,horarioCidadeFormatado)
}

function converterData(dataCompleta){
    const a = new Date(dataCompleta)
    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate()
    const hour = a.getHours()
    const min = a.getMinutes()
    const time = date + ' ' + month + ' ' + year + ' ' + hour + 'h' + min;
    return time;
}

async function getIconeClima(idIcone){
    if(!idIcone){
        alert('Sem ícones')
        return
    }

    const iconeURL = `https://openweathermap.org/img/wn/${idIcone}@2x.png`

    try {
        const response = await fetch(iconeURL)
        const iconePNG = response.url
        return iconePNG
    } catch (error) {
        console.error('Erro fetching icon:', error);
        alert('Error fetching icon. Please try again.')
    }
}

async function timeLocal(cidade){
    if(!cidade){
        alert('Sem cidade inserida.')
        return;
    }

    const timeURL = `https://api.ipgeolocation.io/timezone?apiKey=${timeKEY}&location=${cidade}`

    try{ 
        const response = await fetch(timeURL)
        const data = await response.json()
        console.log(data)
        const dataCompletaCidade = data.date_time_txt
        const dataConvertida = converterData(dataCompletaCidade)
        return dataConvertida
        }
    catch(error) {
            console.error('Erro fetching current date:', error);
            alert('Error fetching current date. Please try again.')
        }
}

async function displayWeather(cidade,pais,date){
    await inserirInfosCidade(cidade, pais, date)


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
}

async function inserirInfosCidade(cidade,pais,data){
    cityInfos.innerHTML = `
        <div class="city-info">
            <h1 class="city-name">${cidade}, ${pais}</h1>
            <div class="city-date-container">
                <h2 class="city-date">${data}</h2>
            </div>
        </div>
    `
}

//Events
searchBtn.addEventListener("click", (e)=> {
    e.preventDefault();

    const city = cityInput.value

    getWeatherData(city)
})