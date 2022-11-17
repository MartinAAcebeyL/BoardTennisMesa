// import { puntos_equipo_1, puntos_equipo_2, sets_equipo_1, sets_equipo_2 } from "./localstorage";

//puntos
const puntos_equipo_1 = "puntos-equipo-1";
const puntos_equipo_2 = "puntos-equipo-2";
//sets
const sets_equipo_1 = "sets-equipo-1";
const sets_equipo_2 = "sets-equipo-2";

//varios
let limite_puntos = 11;
let limite_sets = 7;
let inicia_partido = false;

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
        localStorage.setItem(puntos_equipo_1, 0);
        localStorage.setItem(puntos_equipo_2, 0);
        //sets de cada equipo
        localStorage.setItem(sets_equipo_1, 0);
        localStorage.setItem(sets_equipo_2, 0);

        inicia_partido = true;
    }

    if (reloj_activado)
        timer()
    else {
        clearTimeout(t)
    }
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
    // localStorage.setItem("hrs", hrs);
    // localStorage.setItem("min", min);
    // localStorage.setItem("sec", sec);
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
    if (puntos_equipos[0] == event.target) {
        puntos_actuales = parseInt(localStorage.getItem(puntos_equipo_1));
        localStorage.setItem(puntos_equipo_1, ++puntos_actuales);
    } else {
        puntos_actuales = parseInt(localStorage.getItem(puntos_equipo_2));
        localStorage.setItem(puntos_equipo_2, ++puntos_actuales);
    }
    this.textContent = puntos_actuales.toString();
    if (puntos_equipos[0].textContent == limite_puntos - 1 && puntos_equipos[1].textContent == limite_puntos - 1)
        limite_puntos += 2
    console.clear()
    console.log(limite_puntos);
    sumarSets(this);
}

function actualizarPuntos() {
    puntos_equipos.forEach(
        el => el.textContent = 0
    )
    localStorage.setItem(puntos_equipo_1, 0);
    localStorage.setItem(puntos_equipo_2, 0);
}

puntos_equipos.forEach(el => el.addEventListener(
    'click', sumarPuntos
));

//sets ganados
const sets_equipos = document.querySelectorAll(".sets");

function sumarSets(t) {
    if (t.textContent > limite_puntos) {
        t.textContent = 0
        if (t == puntos_equipos[0])
            actualiar_set(sets_equipo_1, 1);
        else
            actualiar_set(sets_equipo_2, 2);
        limite_puntos = 11
    }
}

function actualiar_set(set_equipo, equipo) {
    equipo -= 1;
    let sets_actuales = parseInt(localStorage.getItem(set_equipo));
    localStorage.setItem(set_equipo, ++sets_actuales);
    sets_equipos[equipo].textContent = sets_actuales.toString();
    alguien_gano(sets_equipos[equipo]);
    actualizarPuntos()
}

function alguien_gano(t) {
    if (t.textContent >= limite_sets / 2) {
        sets_equipos[0] == t ? alert("the winner team 1") : alert("the winner team 2");
    }
}

// general
if (localStorage.length > 0) {
    //puntos de cada equipo
    puntos_equipos[0].textContent = parseInt(localStorage.getItem(puntos_equipo_1));
    puntos_equipos[1].textContent = parseInt(localStorage.getItem(puntos_equipo_2));
    //sets de cada equipo
    sets_equipos[0].textContent = parseInt(localStorage.getItem(sets_equipo_1));
    sets_equipos[1].textContent = parseInt(localStorage.getItem(sets_equipo_2));
}