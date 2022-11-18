import { _equipo1 as equipo1, _equipo2 as equipo2 } from "./factory.js"

//varios
let limite_puntos = 11;
let limite_sets = 7;
let inicia_partido = false;
let ultimo_juego = null;

//reloj
const reloj = document.querySelector("#reloj");

let reloj_activado = false;

let hrs = 0;
let min = 0;
let sec = 0;
var t;

reloj.addEventListener('click', () => {
    reloj_activado = !reloj_activado;

    if (reloj_activado && !inicia_partido) {
        //puntos de cada equipo
        localStorage.setItem(equipo1.puntos_ls, 0);
        localStorage.setItem(equipo2.puntos_ls, 0);
        //sets de cada equipo
        localStorage.setItem(equipo1.sets_ls, 0);
        localStorage.setItem(equipo2.sets_ls, 0);

        inicia_partido = true;
    }

    reloj_activado ? timer() : clearTimeout(t);
});


function tick() {
    sec++;
    if (sec >= 60) {
        sec = 0;
        min++;
        if (min >= 60) {
            min = 0;
            hrs++;
        }
    }
}

function add() {
    tick();

    reloj.textContent = (hrs > 9 ? hrs : "0" + hrs)
        + ":" + (min > 9 ? min : "0" + min)
        + ":" + (sec > 9 ? sec : "0" + sec);
    timer();
}

function timer() {
    t = setTimeout(add, 1000);
}

//puntos ganados
const puntos_equipos = document.querySelectorAll(".puntos");

function sumarPuntos(event) {
    let puntos_actuales;
    //puntos_equipos[0]
    if (equipo1.etiqueta_puntos == event.target) {
        puntos_actuales = parseInt(localStorage.getItem(equipo1.puntos_ls));
        localStorage.setItem(equipo1.puntos_ls, ++puntos_actuales);
        ultimo_juego = equipo1;
    } else {
        puntos_actuales = parseInt(localStorage.getItem(equipo2.puntos_ls));
        localStorage.setItem(equipo2.puntos_ls, ++puntos_actuales);
        ultimo_juego = equipo2;
    }
    this.textContent = puntos_actuales.toString();
    if (equipo1.etiqueta_puntos.textContent == limite_puntos - 1 && equipo2.etiqueta_puntos.textContent == limite_puntos - 1)
        limite_puntos += 2
    console.clear()
    sumarSets(this);
}

function actualizarPuntos() {
    puntos_equipos.forEach(
        el => el.textContent = 0
    )
    localStorage.setItem(equipo1.puntos_ls, 0);
    localStorage.setItem(equipo2.puntos_ls, 0);
}

puntos_equipos.forEach(el => el.addEventListener(
    'click', sumarPuntos
));

//sets ganados
function sumarSets(t) {
    if (t.textContent > limite_puntos) {
        t.textContent = 0
        if (t == equipo1.etiqueta_puntos)
            actualiar_set(equipo1.sets_ls, equipo1.etiqueta_sets);
        else
            actualiar_set(equipo2.sets_ls, equipo2.etiqueta_sets);
        ultimo_juego = null;
        limite_puntos = 11;
    }
}

function actualiar_set(set_equipo, equipo) {
    let sets_actuales = parseInt(localStorage.getItem(set_equipo));
    localStorage.setItem(set_equipo, ++sets_actuales);
    equipo.textContent = sets_actuales.toString();
    alguien_gano(equipo);
    actualizarPuntos()
}

function alguien_gano(t) {
    const sets_equipos = document.querySelectorAll(".sets");

    if (t.textContent >= limite_sets / 2) {
        sets_equipos[0] == t ? alert("the winner team 1") : alert("the winner team 2");
    }
}

// general
if (localStorage.length > 0) {
    //puntos de cada equipo
    equipo1.etiqueta_puntos.textContent = parseInt(localStorage.getItem(equipo1.puntos_ls));
    equipo2.etiqueta_puntos.textContent = parseInt(localStorage.getItem(equipo2.puntos_ls));
    //sets de cada equipo
    equipo1.etiqueta_sets.textContent = parseInt(localStorage.getItem(equipo1.sets_ls));
    equipo2.etiqueta_sets.textContent = parseInt(localStorage.getItem(equipo2.sets_ls));
}
//volver atras

const flecha = document.querySelector('#atras');

function atras(event) {
    if (ultimo_juego != null) {
        let aux = ultimo_juego.etiqueta_puntos.textContent--;
        localStorage.setItem(ultimo_juego.puntos_ls, --aux);
    }
    ultimo_juego = null;
}

flecha.addEventListener('click', atras)

//Contador de Tarjetas Amarillas
let cont1 = 0,
    cont2 = 0;

function countingClicks1() {
    document.getElementById("contTarjetaAmarilla1").innerHTML = ++cont1;
    if (cont1 >= 2) {
        cont1 = 0;
        cont2 = 0;
        alert("Tarjeta roja, Equipo 1 perdedor");
        document.getElementById("contTarjetaAmarilla1").innerHTML = cont1;
        document.getElementById("contTarjetaAmarilla2").innerHTML = cont1;
    }
}

function countingClicks2() {
    document.getElementById("contTarjetaAmarilla2").innerHTML = ++cont2;
    if (cont2 >= 2) {
        cont1 = 0;
        cont2 = 0;
        alert("Tarjeta roja,Equipo 2 perdedor");
        document.getElementById("contTarjetaAmarilla2").innerHTML = cont2;
        document.getElementById("contTarjetaAmarilla1").innerHTML = cont1;
    }
}