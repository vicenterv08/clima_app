require('dotenv').config()
const { leerInput, 
    inquirerMenu, 
    pausa, 
    listarLugares} = require("./helpers/inquirer");

const Busquedas = require("./models/busquedas");
// import { leerInput } from "./helpers/inquirer";
const main = async() =>{
    const busquedas = new Busquedas();
    let opcion;
    do {
        opcion = await inquirerMenu();
        switch(opcion){
            case 1:
                //Mostrar mensaje
                const busqueda = await leerInput('Ciudad: ');
                //Buscar lugares
                const lugares = await busquedas.ciudad(busqueda);
                //seleccionar el lugar
                const id = await listarLugares(lugares)
                // console.log({id})
                if(id === '0') continue;//se salta a la siguiente iteracion del ciclo
                //guardar en db
                const lugarSeleccionado = lugares.find(lugar => lugar.id === id);
                busquedas.agregarHistorial(lugarSeleccionado.nombre);  
                //CLima consulta    
                const datosClima = await busquedas.climaLugar(lugarSeleccionado.ltd,lugarSeleccionado.lng)
                // console.log(datosClima);
                //Mostrar resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green );
                console.log('Ciudad: ',lugarSeleccionado.nombre.green);
                console.log('Latitud: ',lugarSeleccionado.ltd);
                console.log('Longitud: ',lugarSeleccionado.lng);
                console.log('Temperatura: ',`${datosClima.temperatura}`.magenta);
                console.log('Minima: ',`${datosClima.tempMin}`.cyan);
                console.log('Maxima: ',`${datosClima.tempMax}`.red);
                console.log('Sensacion Termica: ',`${datosClima.senTerm}`.yellow);
                console.log('Humedad: ',`${datosClima.hum}%`.grey);
                console.log('Velocidad viento: ',`${datosClima.velViento}km/h`.grey);
                console.log('Descripcion Clima: ',datosClima.desc.green);
            break;
            case 2:
                if(busquedas.historial.length > 0){ 
                    busquedas.historialCapitalizado.forEach( (lugar,indice) => {
                        const idx = `${indice + 1}`.green;
                        console.log(`${idx} ${lugar}`); 
                    });
                }else{
                    console.log("no hay busquedas");
                }
            break;
        }
        if(opcion!==0) await pausa();
    }while(opcion!==0);
}

main();