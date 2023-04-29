import { Personaje } from './personaje.js';
import { Constants } from './constants.js'


const ID_CABALLERO_NEGRO = "caballeroNegro";
const ID_CABALLERO_REAL = "caballeroReal";
const ID_CABALLERO_TEMPLARIO = "caballeroTemplario";
const ID_HECHICERO_BADASS = "hechicero-badass"
const PIROMANTICO = "piromantico";
const HECHICERO_BLANCO = "hechiceroBlanco"
const HECHICERO_NEGRO = "hechiceroNegro";
// constantes dinamicas
let PERSONAJES_ID = []
let personajesJugador = [];
let personajesEnemigo = [];
let objPersonajeEnemigo;
let objPersonajeJugador;
// para seleccionar el Personaje de la PC
let TOTAL_GUERREROS;
const MINIMO = 1;

// vidas 
const INICIO_VIDAS = 3;
let vidasPC = INICIO_VIDAS;
let vidasPlayer = INICIO_VIDAS;

// contadores
let contadorRachasDerrotas = 0;
let contadorRachasVictorias = 0;
let numRonda = 1;

// ataques traidos de los JSON
let ataqueTurnoJugador;
let ataqueTurnoEnemigo;
let ataquesCaballeroNegro;
let defensasCaballeroNegro;
let ataquesCaballeroReal;
let defensasCaballeroReal;
let ataquesCaballeroTemplario;
let defensasCaballeroTemplario;
let ataquesHechiceroBadass;
let defensasHechiceroBadass;
const FUEGO = 'FUEGO';
const AGUA = 'AGUA';
const TIERRA = 'TIERRA';
const ATAQUES = [FUEGO, AGUA, TIERRA];
const MAX_ATAQUES = ATAQUES.length;
const MIN_ATAQUES = 1;
/* let arrayIDsBotonesDeAtaqueEnPantalla = [];
let arrayIDsBotonesDeDefensaEnPantalla = []; */
const arrayBotonesAtaqueJugador = [];
let arrayAtaquesEnemigo = [];
let objAtaqueEnemigo;
let objAtaqueJugador;

//resultados
const EMPATE = 'empate 😐';
const GANASTE = 'ganaste! 😎';
const PERDISTE = 'perdiste 😕';

// elementos manipulables
//seccion 1
const botonPersonajeJugador = document.getElementById('boton-seleccionar-personaje');
const seccionElegirpersonaje = document.getElementById('seleccionar-personaje');
const contenedorPersonajes = document.getElementById('contenedor-personajes');

//seccion2
const seccionSeleccionarAtaques = document.getElementById('seleccionar-ataque');
const relato = document.getElementById('relato')
const seccionBotonesAtaquesJugador = document.getElementById('seccion-botones-ataques-jugador');
const seccionCantidadAtaquesJugador = document.getElementById('seccion-cantidad-ataques-jugador');
const seccionBotonesDefensaJugador = document.getElementById('seccion-botones-defensa-jugador');
const seccionBotonesAtaquesEnemigo = document.getElementById('seccion-botones-ataques-enemigo');
const seccionBotonesDefensaEnemigo = document.getElementById('seccion-botones-defensa-enemigo');
const nombrePersonajeEnemigoDOM = document.getElementById('personaje-enemigo');
const nombrePersonajeJugadorDOM = document.getElementById('personaje-jugador');
const vidasEnemigo = document.getElementById('barra-vidas-enemigo');
const vidasJugador = document.getElementById('barra-vidas-jugador');
const parrafoAtaqueJugador = document.getElementById('ataque-jugador');
const parrafoAtaqueEnemigo = document.getElementById('ataque-enemigo');
const seccionMensajeFinal = document.getElementById('mensaje-final')
const botonReiniciar = document.getElementById('boton-reiniciar');
const mensajesCombate = document.getElementById('mensajes-combate');

//botones de ataque compartidos
let botonAtaqueDaga;
let botonAtaqueFuerte;
let botonAtaqueDebil;
let botonAtaqueDosManos;
// botones de ataque HB
let botonAtaqueFlechaMagica;
let botonAtaqueRafagaMagica;
// botones de ataque CT
// .
// botones de ataque CR
let botonAtaqueRayo;
let botonAtaqueDobleRayo;
// botones de ataque CN
let botonAtaqueRayo1;
let botonAtaqueRayo2;
let botonAtaqueFuego;

// luego de que se carga todo el HTML, inicia el juego
window.addEventListener('load', iniciarJuego)

async function iniciarJuego() {
    //step 1
    console.log('cargo OK el juego')
    await crearPersonajes();

    // inyecta el js en el DOM
    personajesJugador.forEach((personaje) => {
        let tarjetaPersonaje = `
        <input class="input-tarjeta-personaje" type="radio" name="character" id=${personaje.id}>
        <label class="tarjeta-personaje" for="${personaje.id}">
            <img src=${personaje.foto} alt="${personaje.nombre}">
            <p>${personaje.nombre}</p>
            <p>estadisticas</p>    
        </label>
        `
        contenedorPersonajes.innerHTML += tarjetaPersonaje;
    })

    // reacciona al elegir al Guerrero
    botonPersonajeJugador.addEventListener('click', seleccionarPersonajeJugador)

    // boton de reiniciar oculto por defecto
    botonReiniciar.style.display = 'none';
    botonReiniciar.addEventListener('click', reiniciarJuego);

    // STEP 2 oculta por defecto
    seccionSeleccionarAtaques.style.display = 'none';

}

function seleccionarPersonajeJugador() {
    let personaje = PERSONAJES_ID.filter(element => document.getElementById(element).checked === true);

    if (personaje.length == 0) {
        console.error("No se ha elegido un guerrero")
        alert("Debes seleccionar un Guerrero!")
    } else {
        //obtengo el elemento filtrado
        let personajeID = personaje[0];

        // comparo el id del elemento filtrado vs el id de los personjes disponibles
        personaje = personajesJugador.filter(per => per.id == personajeID)
        // modifica el HTML de forma dinamica
        objPersonajeJugador = personaje[0];
        nombrePersonajeJugadorDOM.innerHTML = objPersonajeJugador.nombre;
        console.log('Has seleccionado a', objPersonajeJugador)
        // oculto seccion elegir personaje
        seccionElegirpersonaje.style.display = 'none';

        // PC elige personaje
        seleccionarpersonajePC();

        // habilito seccion para elegir ataques
        seccionSeleccionarAtaques.style.display = 'flex';
    }
}

function seleccionarpersonajePC() {
    console.log('Se elige el guerrero de la PC de entre ', TOTAL_GUERREROS, ' disponibles.');
    let numRandom = Math.floor(Math.random() * (TOTAL_GUERREROS - MINIMO + 1))
   // let enemigo = personajesEnemigo[numRandom];
    //diego
    let enemigo = personajesEnemigo[0];
    objPersonajeEnemigo = new Personaje(enemigo.id, enemigo.nombre, enemigo.salud, enemigo.foto, enemigo.ataques, enemigo.defensas)
    nombrePersonajeEnemigoDOM.innerHTML = objPersonajeEnemigo.nombre;
    console.log('Tu enemigo sera el', objPersonajeEnemigo)

    cargarAtaquesDefensasEnPantalla();
}

// step 2
function cargarAtaquesDefensasEnPantalla() {
    // creacion de botones de ataque en el front
    objPersonajeJugador.ataques.forEach((atack) => {
        let botonDeAtaque = `
        <button class="boton-ataque" id="${atack.id}">${atack.icon}  ${atack.name} - ${atack.cant} </button> 
        `
        //arrayIDsBotonesDeAtaqueEnPantalla.push(atack.id);
        seccionBotonesAtaquesJugador.innerHTML += botonDeAtaque;

        /*
        // contadores , estan estaticos TODO : corregir
        let cantidadDeAtaques = `
        <button class="boton-ataque" id="cant-ataques">${atack.icon}  ${atack.cant}  </button> 
        `
        //arrayIDsBotonesDeAtaqueEnPantalla.push(atack.id);
        seccionCantidadAtaquesJugador.innerHTML += cantidadDeAtaques;
        */    
    })

    // creacion de botones de defensa en el front
    objPersonajeJugador.defensas.forEach((defense) => {
       let botonDeDefensa = `
       <button class="boton-defensa" id="${defense.id}">${defense.icon}  ${defense.name} - ${defense.cant} </button> 
       `
       //arrayIDsBotonesDeDefensaEnPantalla.push(defense.id);
       seccionBotonesDefensaJugador.innerHTML += botonDeDefensa;
   })

    // creacion de botones de ataque en el front
    objPersonajeEnemigo.ataques.forEach((atack) => {
        let botonDeAtaque = `
        <button class="boton-enemigo boton-ataque" id="enemigo-${atack.id}" >${atack.icon}  ${atack.name} - ${atack.cant} </button> 
        `
        //arrayIDsBotonesDeAtaqueEnPantalla.push(atack.id);
        seccionBotonesAtaquesEnemigo.innerHTML += botonDeAtaque;
    })

    // creacion de botones de defensa en el front
     objPersonajeEnemigo.defensas.forEach((defense) => {
        let botonDeDefensa = `
        <button class="boton-defensa" id="${defense.id} disabled">${defense.icon}  ${defense.name} - ${defense.cant} </button> 
        `
        //arrayIDsBotonesDeDefensaEnPantalla.push(defense.id);
        seccionBotonesDefensaEnemigo.innerHTML += botonDeDefensa;
    })


    //PERSONAJES_ID = [ID_CABALLERO_NEGRO, ID_CABALLERO_REAL, ID_CABALLERO_TEMPLARIO, ID_HECHICERO_BADASS];
    // llamado a funcion que crea y asocia los botones del front con las funciones de JS
    let _id = objPersonajeJugador.id;
    switch (_id) {
        case ID_CABALLERO_NEGRO:
            asociarBotonesCaballeroNegro();
            break;
        case ID_CABALLERO_TEMPLARIO:
            asociarBotonesCaballeroTemplario();
            break;
        case ID_CABALLERO_REAL:
            asociarBotonesCaballeroReal();
            break;
        case ID_HECHICERO_BADASS:
            asociarBotonesHechiceroBadass();
            break;

    }
}

function asociarBotonesCaballeroNegro() {
    botonAtaqueDebil = document.getElementById('ataque-debil');
    botonAtaqueFuerte = document.getElementById('ataque-fuerte');
    botonAtaqueDosManos = document.getElementById('dos-manos');
    botonAtaqueDaga = document.getElementById('ataque-daga');
    botonAtaqueFuego = document.getElementById('ataque-piromancia');

    botonAtaqueDebil.addEventListener('click', ataqueDebil);
    botonAtaqueFuerte.addEventListener('click', ataqueFuerte);
    botonAtaqueDosManos.addEventListener('click', ataqueA2Manos);
    botonAtaqueDaga.addEventListener('click', ataqueDaga)
    botonAtaqueFuego.addEventListener('click', ataquePiromancia);

    arrayBotonesAtaqueJugador.push(botonAtaqueDaga, botonAtaqueDebil, botonAtaqueFuerte, botonAtaqueFuego, botonAtaqueDosManos);
    console.log('diego',arrayBotonesAtaqueJugador);

}

function asociarBotonesCaballeroReal() {
    botonAtaqueRayo = document.getElementById('ataque-rayo');
    botonAtaqueDobleRayo = document.getElementById('doble-rayo');
    botonAtaqueFuerte = document.getElementById('ataque-fuerte');

    botonAtaqueRayo.addEventListener('click', ataqueRayo);
    botonAtaqueDobleRayo.addEventListener('click', ataqueDobleRayo)
    botonAtaqueFuerte.addEventListener('click', ataqueFuerte);

    arrayBotonesAtaqueJugador.push(botonAtaqueRayo, botonAtaqueDobleRayo, botonAtaqueFuerte);
    console.log('diego',arrayBotonesAtaqueJugador);
}

function asociarBotonesCaballeroTemplario() {
    botonAtaqueDebil = document.getElementById('ataque-debil');
    botonAtaqueDaga = document.getElementById('ataque-daga');
    botonAtaqueFuerte = document.getElementById('ataque-fuerte');
    botonAtaqueDosManos = document.getElementById('dos-manos');

    botonAtaqueDebil.addEventListener('click', ataqueDebil);
    botonAtaqueDaga.addEventListener('click', ataqueDaga)
    botonAtaqueFuerte.addEventListener('click', ataqueFuerte);
    botonAtaqueDosManos.addEventListener('click', ataqueA2Manos);

    arrayBotonesAtaqueJugador.push(botonAtaqueDaga, botonAtaqueDebil, botonAtaqueFuerte, botonAtaqueDosManos);
    console.log('diego',arrayBotonesAtaqueJugador);
}

function asociarBotonesHechiceroBadass() {
    botonAtaqueFlechaMagica = document.getElementById('flecha-magica');
    botonAtaqueRafagaMagica = document.getElementById('rafaga-magica');
    botonAtaqueDaga = document.getElementById('ataque-daga');

    botonAtaqueFlechaMagica.addEventListener('click', ataqueFlechaMagica);
    botonAtaqueRafagaMagica.addEventListener('click', ataqueRafagaMagica);
    botonAtaqueDaga.addEventListener('click', ataqueDaga);

    arrayBotonesAtaqueJugador.push(botonAtaqueFlechaMagica, botonAtaqueRafagaMagica, botonAtaqueDaga);
    console.log('diego',arrayBotonesAtaqueJugador);
}
function ataquePiromancia() {
    objAtaqueJugador = objPersonajeJugador.getAtackById('ataque-piromancia');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} - ${objAtaqueJugador.cant} `;
    botonAtaqueFuego.innerHTML = buttonText; 
    ataqueTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarAtaquesPC();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueFuego.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}

function ataqueRayo() {
    objAtaqueJugador = objPersonajeJugador.getAtackById('ataque-rayo');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} - ${objAtaqueJugador.cant} `;
    botonAtaqueRayo.innerHTML = buttonText; 
    ataqueTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarAtaquesPC();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueRayo.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}

function ataqueDobleRayo() {
    objAtaqueJugador = objPersonajeJugador.getAtackById('doble-rayo');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} - ${objAtaqueJugador.cant} `;
    botonAtaqueDobleRayo.innerHTML = buttonText; 
    ataqueTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarAtaquesPC();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueDobleRayo.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}

function ataqueA2Manos() {
    objAtaqueJugador = objPersonajeJugador.getAtackById('dos-manos');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} - ${objAtaqueJugador.cant} `;
    botonAtaqueDosManos.innerHTML = buttonText; 
    ataqueTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarAtaquesPC();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueDosManos.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}

function ataqueFuerte() {
    objAtaqueJugador = objPersonajeJugador.getAtackById('ataque-fuerte');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} - ${objAtaqueJugador.cant} `;
    botonAtaqueFuerte.innerHTML = buttonText; 
    ataqueTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarAtaquesPC();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueFuerte.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}
function ataqueDebil() {
    objAtaqueJugador = objPersonajeJugador.getAtackById('ataque-debil');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} - ${objAtaqueJugador.cant} `;
    botonAtaqueDebil.innerHTML = buttonText; 
    ataqueTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarAtaquesPC();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueDebil.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}
function ataqueFlechaMagica() {
    objAtaqueJugador = objPersonajeJugador.getAtackById('flecha-magica');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} - ${objAtaqueJugador.cant} `;
    botonAtaqueFlechaMagica.innerHTML = buttonText; 
    ataqueTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarAtaquesPC();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueFlechaMagica.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}
function ataqueRafagaMagica() {
    objAtaqueJugador = objPersonajeJugador.getAtackById('rafaga-magica');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} - ${objAtaqueJugador.cant} `;
    botonAtaqueRafagaMagica.innerHTML = buttonText; 
    ataqueTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarAtaquesPC();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueRafagaMagica.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}
function ataqueDaga() {

    objAtaqueJugador = objPersonajeJugador.getAtackById('ataque-daga');
    let buttonText = ` ${objAtaqueJugador.icon} ${objAtaqueJugador.name} - ${objAtaqueJugador.cant} `;
    botonAtaqueDaga.innerHTML = buttonText; 
    ataqueTurnoJugador = objAtaqueJugador.name;
    console.log('elegiste', objAtaqueJugador.name)
    seleccionarAtaquesPC();
    if (objAtaqueJugador.cant == 0) {
        botonAtaqueDaga.disabled = true;
        //botonAtaqueRafagaMagica.style.display = 'none';

        //si todos los ataques estan deshabilitados, perdes por cansancio o el otro te puede atacar y gana el que quede con mas vida al final
        checkIfAllAtacksAreDisabled()
    }
}


function seleccionarAtaquesPC() {
    arrayAtaquesEnemigo = objPersonajeEnemigo.ataques;

    if (arrayAtaquesEnemigo.length != 0) {

        console.warn('ataques array PC', arrayAtaquesEnemigo)
        console.warn('================= ronda numero', numRonda,'=================================')
        let numRandom = Math.floor(Math.random() * (arrayAtaquesEnemigo.length - MIN_ATAQUES + 1));

        //console.log('la PC esta elegiendo sus ataques');
        objAtaqueEnemigo = arrayAtaquesEnemigo[numRandom];
        objAtaqueEnemigo.cant--;
        ataqueTurnoEnemigo = objAtaqueEnemigo.name;
        if (objAtaqueEnemigo.cant == 0) {
            // saca elemento del array
            let ataqueEliminado = objPersonajeEnemigo.deleteElementById(objAtaqueEnemigo.id);
            console.error('se borro el ataque del enemigo:', ataqueEliminado)
            // deshabilita boton 
            document.getElementById(`enemigo-${objAtaqueEnemigo.id}`).disabled = true;
        }

        console.log('la PC elegio de ataque:', ataqueTurnoEnemigo)
        if (arrayAtaquesEnemigo.length == 0) {
            console.warn('El enemigo se quedo sin ataques!')
        }
    } else {
        console.warn('enemigo pasa el turno')
        objAtaqueEnemigo = null;
    }
    numRonda++;
    realizarCombate(objAtaqueJugador, objAtaqueEnemigo);
}

function checkIfAllAtacksAreDisabled(){
    // check si mis ataques estan agotados
    let myMovements = arrayBotonesAtaqueJugador.every((button) => button.disabled == true)
    
    // check if all the enemy movements are disabled
    let enemyMovements = arrayAtaquesEnemigo.length;
    console.log('----result', myMovements, 'ataques dispo Enemigo:', enemyMovements)
// todo: mejorar logica, llamados repetidos
    if (myMovements && enemyMovements == 0){
        determinateWhoWins();
    } else if (myMovements) {
        allowEnemyToAtackWithAllEnergy();
        determinateWhoWins();
    }
}
function determinateWhoWins (){
    console.log('determinando quien gano...')
    let resultado;
    let saludEnemigo = objPersonajeEnemigo.salud; 
    let saludJugador = objPersonajeJugador.salud;
    if(saludEnemigo == saludJugador){
        resultado = EMPATE;
    } else if (saludJugador > saludEnemigo){
        resultado = GANASTE;
    } else {
        resultado = PERDISTE;
    }
    crearMensajeFinDeJuego(resultado);
}
function allowEnemyToAtackWithAllEnergy(){
    let i = 0;
    while (objAtaqueEnemigo !== null && i<10){ // i es un comodin por las dudas...
        console.log('obj ataque', objAtaqueEnemigo)
        console.log('ataque extra numero: ', i)
        i++;
        seleccionarAtaquesPC();
    }
}
// todo: modificar esta logica por completo, segun ataques y defensas
function realizarCombate(objAtaquePlayer, objAtaqueEnemigo) {
    console.log('arranca el combate!')
    let resultado;

    if (ataqueTurnoJugador == ataqueTurnoEnemigo) {
        resultado = EMPATE;
    } else if ((ataqueTurnoJugador == FUEGO && ataqueTurnoEnemigo == TIERRA)
        || (ataqueTurnoJugador == AGUA && ataqueTurnoEnemigo == FUEGO)
        || (ataqueTurnoJugador == TIERRA && ataqueTurnoEnemigo == AGUA)) {
        resultado = GANASTE;
        // actualizarVidasPC();
    } else {
        resultado = PERDISTE;
        //actualizarVidasPlayer();
    }

    // TODO: el suceso es la convinacion de los dos movimientos seleccionados. 
    // pendiente, funcion que compara ataques y determina que suceso salio.
    let suceso = 'espadazo OK';

    // crea elemento con texto del combate
    crearMensajeCombate(resultado, suceso);

    if (vidasPC == 0) {
        // mostrar animacion que ganaste
        crearMensajeFinDeJuego(GANASTE);
    }

    if (vidasPlayer == 0) {
        // mostrar animacion que perdiste
        crearMensajeFinDeJuego(PERDISTE);
    }
}

function actualizarVidasPC() {
    vidasPC--;
    vidasEnemigo.innerHTML = vidasPC;
}

function actualizarVidasPlayer() {
    vidasPlayer--;
    vidasJugador.innerHTML = vidasPlayer;

}
async function crearPersonajes() {
    // todo: recibir de parametro cuantos guerreros diferentes crear
    PERSONAJES_ID = [ID_CABALLERO_NEGRO, ID_CABALLERO_REAL, ID_CABALLERO_TEMPLARIO, ID_HECHICERO_BADASS];

    await obtenerAtaquesDefensas();

    let caballeroNegro = new Personaje(ID_CABALLERO_NEGRO, 'Caballero Negro', 120,
        './../assets/img/personajes/caballero-negro.png', ataquesCaballeroNegro, defensasCaballeroNegro);

    let caballeroReal = new Personaje(ID_CABALLERO_REAL, 'Caballero Real', 100,
        './../assets/img/personajes/caballero-real.png', ataquesCaballeroReal, defensasCaballeroReal);

    let caballeroTemplario = new Personaje(ID_CABALLERO_TEMPLARIO, 'Caballero Templario', 110,
        './../assets/img/personajes/caballero_templario.png', ataquesCaballeroTemplario, defensasCaballeroTemplario);

    let hechiceroBadass = new Personaje(ID_HECHICERO_BADASS, 'Hechicero Badass', 90,
        './../assets/img/personajes/hechicero-badass.png', ataquesHechiceroBadass, defensasHechiceroBadass);


    personajesJugador = [caballeroNegro, caballeroReal, caballeroTemplario, hechiceroBadass];
    // clono el array para evitar conflictos en el combate
    //personajesEnemigo = structuredClone(personajesJugador);
    personajesEnemigo = JSON.parse(JSON.stringify(personajesJugador))
    TOTAL_GUERREROS = personajesJugador.length;

    console.log('Los guerreros esperan su destino...', personajesJugador, personajesEnemigo);

}

async function obtenerAtaquesDefensas() {

    // Caballero Negro
    await fetch('./../assets/caballero-negro/ataques-caballero-negro.json')
        .then(response => response.json())
        .then(json => {
            ataquesCaballeroNegro = json.atacks;
        })

    await fetch('./../assets/caballero-negro/defensas-caballero-negro.json')
        .then(response => response.json())
        .then(json => {
            defensasCaballeroNegro = json.defense;
        })

    // Caballero Real
    await fetch('./../assets/caballero-real/ataques-caballero-real.json')
        .then(response => response.json())
        .then(json => {
            ataquesCaballeroReal = json.atacks;
        })

    await fetch('./../assets/caballero-real/defensas-caballero-real.json')
        .then(response => response.json())
        .then(json => {
            defensasCaballeroReal = json.defense;
        })

    // Hechicero Badass
    await fetch('./../assets/caballero-templario/ataques-caballero-templario.json')
        .then(response => response.json())
        .then(json => {
            ataquesCaballeroTemplario = json.atacks;
        })

    await fetch('./../assets/caballero-templario/defensas-caballero-templario.json')
        .then(response => response.json())
        .then(json => {
            defensasCaballeroTemplario = json.defense;
        })

    // Hechicero Badass
    await fetch('./../assets/hechicero-badass/ataques-hechicero-badass.json')
        .then(response => response.json())
        .then(json => {
            ataquesHechiceroBadass = json.atacks;
        })

    await fetch('./../assets/hechicero-badass/defensas-hechicero-badass.json')
        .then(response => response.json())
        .then(json => {
            defensasHechiceroBadass = json.defense;
        })

}

function crearMensajeFinDeJuego(mensaje) {
    let mensajeFinal = document.createElement('p');
    if (mensaje == GANASTE) {
        mensajeFinal.innerHTML = 'VAMOOO GANASTE!!'
        contadorRachasVictorias++;
    } else if (mensaje == PERDISTE) {
        mensajeFinal.innerHTML = 'Te derrotaron, vuelve a intentarlo, no te rindas!'
        contadorRachasDerrotas++;
    } else if (mensaje == EMPATE) {
        mensajeFinal.innerHTML = 'qUE RESULTADO CULIAO!'
        contadorRachasDerrotas++;
    } else {
        console.error('entro aca, no deberia....')
        mensajeFinal.innerHTML = 'ERROR!!!!'
    }
    deshabilitarBotonesDeAtaque();
    seccionMensajeFinal.appendChild(mensajeFinal)


    // habilito boton reiniciar
    botonReiniciar.style.display = 'block';
}

/**
 * Al finalizar el juego, inhabilita a todos los botones de ataques
 */
function deshabilitarBotonesDeAtaque() {
    console.warn('se inhabilitan los botones de ataque')
    seccionBotonesAtaquesJugador.style.display = 'none';
}

function crearMensajeCombate(resultado, suceso) {
    // actualiza valors tablas grid
    parrafoAtaqueJugador.innerHTML = ataqueTurnoJugador;
    parrafoAtaqueEnemigo.innerHTML = ataqueTurnoEnemigo;

    //editamos el relato
   // console.log(suceso)
    relato.innerHTML = obtenerFraseSegunSuceso(suceso)

    // creamos el elemento p
    let parrafo = document.createElement('p');
    parrafo.innerHTML = `Atacas con ${ataqueTurnoJugador}, y el enemigo se defiende con ${ataqueTurnoEnemigo} --> ${resultado}`;
    // insertamos el elemento en el HTML
    mensajesCombate.appendChild(parrafo);
}

function obtenerFraseSegunSuceso(suceso) {
    let relato;
    if (suceso == 'rodo OK') {
        relato = 'Esquivaste justo! sigue asi!!';
    } else if (suceso == 'defensa efectiva') {
        relato = 'El escudo te salvo justo! Ten cuidado!!'
    } else if (suceso == 'espadazo OK') {
        relato = 'Como entro esa estocada!';
    } else if (suceso == 'espadazo-no-OK') {
        relato = 'La anticipaste mucho, te vieron venir...'
    } else {
        relato = 'siga !! sigaaa!!! '
    }
   // console.log(relato)
    return relato;
}

function reiniciarJuego() {
    location.reload();
}


