const inquirer = require('inquirer');
// import inquirer from 'inquirer';
require('colors');
// import colors from 'colors';

const preguntas = [ 
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            }, 
            {
                value: 0,
                name: `${'3.'.green} Salir`
            }, 
        ]
    }
];

const inquirerMenu = async() =>{
    
    console.clear();
    console.log('==========================='.green);
    console.log('  Seleccione una opcion'.white);
    console.log('===========================\n'.green);
    //desestructuramos para unicamente regresar el value va el name que le pusimos 
    const {opcion}= await inquirer.prompt(preguntas);
    return opcion;
}
const pausa = async() =>{
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'ENTER'.blue} para continuar...`
        }
    ];
    console.log("\n");
    await inquirer.prompt(question);
    
}

const leerInput = async (message) =>{
    const question = [
        {
            type: 'input',//la persona pueda escribir
            name: 'desc',//
            message, 
            validate( value ) {
                if(value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];
    //usamos el question 
    const {desc} = await inquirer.prompt(question);
    return desc;
}

const listarLugares = async(lugares = []) =>{
    if(lugares.length!=0){
        let i=0;
        const choices = lugares.map((lugar,indice) =>{
            i++;
            const idx = `${indice+1}.`.green;
            return {
                value: lugar.id,
                name: `${idx} ${lugar.nombre}` 
            }
        });
        const pageSize = i+1;
        choices.unshift({
            value: '0',
            name: '0.'.green + ' Cancelar'
        })
        const preguntas = [
            {
                type: 'list',
                pageSize,
                // loop: false,
                name: 'id', 
                message: 'Seleccione lugar:',
                choices 
            }
        ]
        const {id} = await inquirer.prompt(preguntas);
        return id;
    }else{
        return 1;
    }
}

const confirmar = async (message)  =>{
     const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
     ];
     const {ok} = await inquirer.prompt(question);
     return ok;
}

const mostrarListadoCheckList = async(tareas = []) =>{
    if(tareas.length!=0){
        let i=0;
        const choices = tareas.map((tarea,indice) =>{
            i++;
            const idx = `${indice+1}.`.green;
            return {
                value: tarea.id,
                name: `${idx} ${tarea.desc}` ,
                checked: (tarea.completado) ? true : false
            }
        }); 
        const pageSize = i; 
        // console.log(choices);
        const pregunta = [
            {
                pageSize,
                type: 'checkbox',
                name: 'ids', 
                message: 'Seleccione',
                choices 
            }
        ]
        const {ids} = await inquirer.prompt(pregunta);
        return ids;
    }else{
        return 1;
    }
}

module.exports = {
    inquirerMenu, 
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoCheckList
}


// con el type: module
// export {
//     inquirerMenu, 
//     pausa,
//     leerInput,
//     listadoBorrarTareas,
//     confirmar,
//     mostrarListadoCheckList
// }
    