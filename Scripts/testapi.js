(()=> {
const apiKEY = '563d3432cd1394d7ff15b978d9aa148e'
const timeKEY = '174bbe7276ed4359a11f5024026858aa'

const cityInput = document.querySelector('#city-input');
const searchBtn = document.querySelector('#search');
const cityWeatherArea = document.querySelector('#city-infos-container');
const errorMessageDiv = document.querySelector('#error-message')

//Functions
async function getWeatherData(cidade){
    if(!cidade){
        errorMessageDiv.innerHTML = 'Por favor, insira uma cidade.'
        return;
    }

    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${apiKEY}&lang=pt_br`

    try{ 
        const response = await fetch(currentWeatherURL)
        const data = await response.json()

        if(data.cod === '404'){
            throw new Error('Cidade não encontrada');
        }

        const weatherData = {
            cidadeNome: data.name,
            cidadePais: data.sys.country,
            iconeClima: data.weather[0].icon,
            temperatura: parseInt(data.main.temp),
            sensacao: parseInt(data.main.feels_like),
            condicao: primeiraLetraMaiuscula(data.weather[0].description),
            vento: data.wind.speed,
            umidade: data.main.humidity,
            visibi: data.visibility / 1000,
            pressure: data.main.pressure
        }

        const horarioCidadeFormatado = await timeLocal(weatherData.cidadeNome)
        const cidadeIconeClima = await getIconeClima(weatherData.iconeClima)
        const indiceArPoluido = await getCoordData(weatherData.cidadeNome)
        const frasePoluicaoDoAr = classificacaoAr(indiceArPoluido.indicePoluicao)
        
        inserirInfosClima(weatherData.cidadeNome,weatherData.cidadePais,horarioCidadeFormatado,cidadeIconeClima,weatherData.temperatura,weatherData.sensacao, weatherData.condicao)
        inserirDetalhesClima(weatherData.condicao,weatherData.vento,weatherData.umidade,weatherData.visibi,weatherData.pressure,indiceArPoluido.indicePoluicao,frasePoluicaoDoAr);

    } catch(error) {
        console.error('Erro fetching current weather data:', error);
        errorMessageDiv.textContent = error.message;
    }
}

function primeiraLetraMaiuscula(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function converterData(dataCompleta){
    const a = new Date(dataCompleta)
    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate()
    const hour = a.getHours().toString().padStart(2,'0');
    const min = a.getMinutes().toString().padStart(2,'0');
    const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
    return time;
}

async function timeLocal(cidade) {
    const timeURL = `https://api.ipgeolocation.io/timezone?apiKey=${timeKEY}&location=${cidade}`;

    try {
        const { date_time_txt } = await fetch(timeURL).then(response => response.json());
        return converterData(date_time_txt);
    } catch (error) {
        console.error('Erro fetching current date:', error);
    }
}

async function getIconeClima(idIcone){
    const iconeURL = `https://openweathermap.org/img/wn/${idIcone}@2x.png`;

    try {
        const response = await fetch(iconeURL);
        const iconePNG = response.url;
        return iconePNG;
    } catch (error) {
        console.error('Erro fetching icon:', error);
        errorMessageDiv.textContent += error.message
    }
}

function classificacaoAr(numeroAr){
    let fraseQualidadeAr = ''

    switch(numeroAr){
        case 1: 
            fraseQualidadeAr = 'Ótimo'
            break;
        case 2: 
            fraseQualidadeAr = 'Bom'
            break
        case 3: 
            fraseQualidadeAr = 'Moderado'
            break
        case 4:
            fraseQualidadeAr = 'Ruim'
            break
        case 5:
            fraseQualidadeAr = 'Péssimo'
            break
    }

    return fraseQualidadeAr
}

async function getPollution(lat,lon){
    if(!lat || !lon){
        errorMessageDiv.textContent += 'Erro ao obter coordenadas.'
        return
    }

    const poluicaoURL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKEY}`

    try {
        const response = await fetch(poluicaoURL)
        const data = await response.json()

        const indicePoluicao = data.list[0].main.aqi
        return indicePoluicao
    } catch (error) {
        console.error('Erro fetching icon:', error);
    }
}

async function getCoordData(cidade){
    const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cidade}&limit=2&appid=${apiKEY}`

    try{
        const response = await fetch(geoURL)
        if(!response.ok){
            throw new Error(`Erro no HTTP! Status: ${response.status}`);
        }

        const data = await response.json()

        if(!data[0] || !data[0].lat || !data[0].lon){
            throw new Error('Dados inválidos na API.');
        }
        const cidadeLat = data[0].lat
        const cidadeLon = data[0].lon

        const indicePoluicao = await getPollution(cidadeLat,cidadeLon)
        return {cidadeLat, cidadeLon, indicePoluicao}
    } catch (error) {
        console.error('Error fetching coords:', error);
    }
}

function converterDia(dataCompleta){
    const a = new Date(dataCompleta)
    const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    const diaSemana = dias[a.getDay()];
    const dia = a.getDate();
    const mes = a.getMonth() + 1;
    return `${diaSemana} - ${dia}/${mes}`;
}

async function getForecast(lat,lon){
    if(!lat || !lon){
        errorMessageDiv.textContent += 'Erro ao obter coordenadas.'
        return
    }

    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=40&lang=pt_br&units=metric&appid=${apiKEY}`

    try {
        const response = await fetch(forecastURL)
        const data = await response.json()

        const datas = [
            converterDia(data.list[2].dt_txt),
            converterDia(data.list[10].dt_txt),
            converterDia(data.list[18].dt_txt),
            converterDia(data.list[26].dt_txt),
            converterDia(data.list[34].dt_txt)
        ]
        
        const icones = [
            await getIconeClima(data.list[2].weather[0].icon),
            await getIconeClima(data.list[10].weather[0].icon),
            await getIconeClima(data.list[18].weather[0].icon),
            await getIconeClima(data.list[26].weather[0].icon),
            await getIconeClima(data.list[34].weather[0].icon)
        ];

        const tempsMax = [
            parseInt(data.list[2].main.temp_max),
            parseInt(data.list[10].main.temp_max),
            parseInt(data.list[18].main.temp_max),
            parseInt(data.list[26].main.temp_max),
            parseInt(data.list[34].main.temp_max)
        ];

        const tempsMin = [
            parseInt(data.list[2].main.temp_min),
            parseInt(data.list[10].main.temp_min),
            parseInt(data.list[18].main.temp_min),
            parseInt(data.list[26].main.temp_min),
            parseInt(data.list[34].main.temp_min)
        ];

        const chanceChuva = [
            `${data.list[2].pop*100}%`,
            `${data.list[10].pop*100}%`,
            `${data.list[18].pop*100}%`,
            `${data.list[26].pop*100}%`,
            `${data.list[34].pop*100}%`
        ];

        const condicoes = [
            primeiraLetraMaiuscula(data.list[2].weather[0].description),
            primeiraLetraMaiuscula(data.list[10].weather[0].description),
            primeiraLetraMaiuscula(data.list[18].weather[0].description),
            primeiraLetraMaiuscula(data.list[26].weather[0].description),
            primeiraLetraMaiuscula(data.list[34].weather[0].description)
        ];

        const forecastArea = document.querySelector('#forecast-container');

        forecastArea.innerHTML = `
            <h2 class="forecast-title">Previsão para os próximos dias</h2>
            <h4 class="forecast-title-obs">(Baseado no momento atual de pesquisa)</h4>

            <div class="forecast-cards-container">
                <div class="forecast-card">
                    <h3 class="forecast-card-date">${datas[0]}</h3>
                    <img src="${icones[0]}" alt="Ícone do clima" class="forecast-card-icon">
                    <p class="forecast-card-temps">Máx: ${tempsMax[0]}°C </br> Min: ${tempsMin[0]}°C</p>
                    <p class="forecast-card-condicao">${condicoes[0]}</p>
                    <p class="forecast-card-chuva">Chance de chuva: ${chanceChuva[0]}</p>
                </div>
                <div class="forecast-card">
                    <h3 class="forecast-card-date">${datas[1]}</h3>
                    <img src="${icones[1]}" alt="Ícone do clima" class="forecast-card-icon">
                    <p class="forecast-card-temps">Máx: ${tempsMax[1]}°C </br> Min: ${tempsMin[1]}°C</p>
                    <p class="forecast-card-condicao">${condicoes[1]}</p>
                    <p class="forecast-card-chuva">Chance de chuva: ${chanceChuva[1]}</p>
                </div>
                <div class="forecast-card">
                    <h3 class="forecast-card-date">${datas[2]}</h3>
                    <img src="${icones[2]}" alt="Ícone do clima" class="forecast-card-icon">
                    <p class="forecast-card-temps">Máx: ${tempsMax[2]}°C </br> Min: ${tempsMin[2]}°C</p>
                    <p class="forecast-card-condicao">${condicoes[2]}</p>
                    <p class="forecast-card-chuva">Chance de chuva: ${chanceChuva[2]}</p>
                </div>
                <div class="forecast-card">
                    <h3 class="forecast-card-date">${datas[3]}</h3>
                    <img src="${icones[3]}" alt="Ícone do clima" class="forecast-card-icon">
                    <p class="forecast-card-temps">Máx: ${tempsMax[3]}°C </br> Min: ${tempsMin[3]}°C</p>
                    <p class="forecast-card-condicao">${condicoes[3]}</p>
                    <p class="forecast-card-chuva">Chance de chuva: ${chanceChuva[3]}</p>
                </div>
                <div class="forecast-card">
                    <h3 class="forecast-card-date">${datas[4]}</h3>
                    <img src="${icones[4]}" alt="Ícone do clima" class="forecast-card-icon">
                    <p class="forecast-card-temps">Máx: ${tempsMax[4]}°C </br> Min: ${tempsMin[4]}°C</p>
                    <p class="forecast-card-condicao">${condicoes[4]}</p>
                    <p class="forecast-card-chuva">Chance de chuva: ${chanceChuva[4]}</p>
                </div>
            </div>
        `
        forecastArea.style.display = 'flex'

    } catch (error) {
        console.error('Erro fetching forecast:', error);
    }
}




async function inserirInfosClima(cidade,pais,data,icone,temp,sens){
    cityWeatherArea.innerHTML = `
        <div class="city-info">
            <h1 class="city-name">${cidade}, ${pais}</h1>
            <div class="city-date-container">
                <h2 class="city-date">${data}</h2>
            </div>
        </div>

        <div class="city-weather-infos">
            <img src="${icone}" alt="Ícone do clima" class="icone-clima">
            <div class="weater-temps-container">
                <h1 class="weather-temperatura">${temp}°C</h1>
                <h2 class="weather-sensacao">Sensação de ${sens}°C</h2>
            </div>
        
            <div class="weather-conditions-container" id="detalhes-clima-container">
            </div>
        </div>
    `

    cityWeatherArea.style.display = 'block'
}

async function inserirDetalhesClima(condicaoClima, vento, umidade, visibilidade, pressao, ar, fraseAr){
    const detailsWeatherArea = document.querySelector('#detalhes-clima-container');

    detailsWeatherArea.innerHTML = `
        <h2 class="weather-condition">${condicaoClima}</h2>
        <div class="weather-conditions-details">
        <p class="weather-conditions-details-item">Vento <i class="fa-solid fa-circle-info fa-xs" style="color: #ffffff;"></i><br><br>
           ${vento} km/h
        </p>
        <p class="weather-conditions-details-item">Humidade <span class="texto-hover vento">Indica a quantidade total de água em estado gasoso presente na atmosfera.</span><i class="fa-solid fa-circle-info fa-xs" style="color: #ffffff;"></i><br><br>
        ${umidade}%
        </p> 
        <p class="weather-conditions-details-item">Visibilidade <span class="texto-hover vento">Distância máxima que se pode ver com clareza em uma direção horizontal</span><i class="fa-solid fa-circle-info fa-xs" style="color: #ffffff;"></i><br><br>
            ${visibilidade} km
        </p>
        <p class="weather-conditions-details-item">Pressão <span class="texto-hover vento">O peso do ar na atmosfera.</span><i class="fa-solid fa-circle-info fa-xs" style="color: #ffffff;"></i><br><br>
            ${pressao} mb
        </p>
        <p class="weather-conditions-details-item">Qualidade do ar <em class="texto-hover vento">Afetado pela presença de gases poluentes.</em><i class="fa-solid fa-circle-info fa-xs" style="color: #ffffff;"></i><br><br>
            ${ar} - ${fraseAr}
        </p>
    </div>
    `

    cityWeatherArea.style.display = 'block'
}

//Events
searchBtn.addEventListener("click", async (e)=> {
    errorMessageDiv.innerHTML = '';
    e.preventDefault();

    const city = cityInput.value

    getWeatherData(city)
    const coordData = await getCoordData(city)
    getForecast(coordData.cidadeLat,coordData.cidadeLon)
    
})

})();