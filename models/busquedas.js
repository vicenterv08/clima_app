const fs = require('fs');//fileSystem
const axios = require('axios');
const { isUtf8 } = require('buffer');
class Busquedas{
    historial = [];
    //path de la bd
    dbPath = './db/database.json';
    
    constructor(){
        // TODO:leer db si existe
        this.leerBD();
    }

    get historialCapitalizado(){
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            // console.log(palabras);
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1))
            return palabras.join(' ');
        })
    }

    get paramsMapsbox(){
        return {     
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'languaje': 'es'
        }
    }
    get paramsOpenWeatherMap(){
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }
    //metodo asyncrono
    async ciudad(lugar = ''){
        //peticion http
        try{
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                //lo que viene despues de un signo de interrogacion en una peticion url
                //significa que son los parametro que se envian en el url y los definiremos como
                params: this.paramsMapsbox
            });
            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                ltd: lugar.center[1]
            }))
        }catch(error){
            return [];
        }
    }

    async climaLugar(lat,lon){
        try {
            const intance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    lat,
                    lon,
                    ...this.paramsOpenWeatherMap
                }
            })
            const resp = await intance.get();
            const {weather,main,wind} = resp.data;
            return ({
                desc: weather[0].description,
                temperatura: main.temp,
                tempMin: main.temp_min,
                tempMax: main.temp_max,
                senTerm: main.feels_like,
                hum: main.humidity,
                velViento: wind.speed
            }) 
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = ''){
        //evitar duplicidad
        if(this.historial.includes(lugar.toLowerCase())){
            //no graba nada si ya existe
            return;
        }
        // this.historial = this.historial.splice(0,5);
        this.historial = this.historial.splice(0,5 );
        this.historial.unshift(lugar.toLowerCase());
        
        //grabar 
        this.guardarBD();
    }
    guardarBD(){
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath,JSON.stringify(payload));
    }
    leerBD(){
        //existe
        if(!fs.existsSync(this.dbPath)) return;
        const info = fs.readFileSync(this.dbPath,{encoding: 'utf-8'});
        const data = JSON.parse(info);
        this.historial =  data.historial;
    }
}

module.exports = Busquedas;


