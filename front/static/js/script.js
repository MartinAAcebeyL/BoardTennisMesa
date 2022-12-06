import { sets } from './consumoAPi.js';
import {
    _equipo1 as equipo1,
    _equipo2 as equipo2,
} from './factory.js';
import serializar from './postDatos.js';

//varios
let limite_puntos = 11;
let limite_sets = sets;
let inicia_partido = localStorage.getItem('iniciar_partido') || false;
let ultimo_juego = null;


let array_puntos1 = [];
let array_puntos2 = [];


//reloj
const reloj = document.querySelector("#reloj");

let reloj_activado = localStorage.getItem('reloj_activado');

let hrs = localStorage.getItem('hrs') || 0;
let min = localStorage.getItem('min') || 0;
let sec = localStorage.getItem('sec') || 0;
var t;

reloj.addEventListener('click', () => {
    reloj_activado = true ? (localStorage.getItem('reloj_activado') == 'false' || localStorage.getItem('reloj_activado') == null) : false;

    if (reloj_activado && !inicia_partido) {
        //puntos de cada equipo
        localStorage.setItem(equipo1.puntos_ls, 0);
        localStorage.setItem(equipo2.puntos_ls, 0);
        //sets de cada equipo
        localStorage.setItem(equipo1.sets_ls, 0);
        localStorage.setItem(equipo2.sets_ls, 0);

        localStorage.setItem('iniciar_partido', true);

        //reloj
        localStorage.setItem('hrs', 0);
        localStorage.setItem('min', 0);
        localStorage.setItem('sec', 0);
    }

    localStorage.setItem('reloj_activado', reloj_activado);
    reloj_activado == true ? timer() : clearTimeout(t);
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
    localStorage.setItem('hrs', hrs);
    localStorage.setItem('min', min);
    localStorage.setItem('sec', sec);
}

function add() {
    tick();

    reloj.textContent = (hrs > 9 ? hrs : "0" + hrs) +
        ":" + (min > 9 ? min : "0" + min) +
        ":" + (sec > 9 ? sec : "0" + sec);
    timer();
}

function timer() {
    t = setTimeout(add, 1000);
}

//puntos ganados
const puntos_equipos = document.querySelectorAll(".puntos");

function sumarPuntos(event) {
    let puntos_actuales;
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
    if (equipo1.etiqueta_puntos.textContent == limite_puntos - 1 && equipo2.etiqueta_puntos.textContent == limite_puntos - 1) {
        limite_puntos = parseInt(equipo1.etiqueta_puntos.textContent) + 2;
    }
    sumarSets(this);
}

function actualizarPuntos() {
    puntos_equipos.forEach(
        el => el.textContent = 0
    )
    localStorage.setItem(equipo1.puntos_ls, 0);
    localStorage.setItem(equipo2.puntos_ls, 0);
    limite_puntos = 11;
}

puntos_equipos.forEach(el => el.addEventListener(
    'click', sumarPuntos
));

//sets ganados
function sumarSets(t) {
    if (t.textContent >= limite_puntos) {
        array_puntos1.push(localStorage.getItem(equipo1.puntos_ls))
        array_puntos2.push(localStorage.getItem(equipo2.puntos_ls))
        if (t == equipo1.etiqueta_puntos)
            actualiar_set(equipo1.sets_ls, equipo1.etiqueta_sets);
        else
            actualiar_set(equipo2.sets_ls, equipo2.etiqueta_sets);
        ultimo_juego = null
    }
}

function actualiar_set(set_equipo, equipo) {
    let sets_actuales = parseInt(localStorage.getItem(set_equipo));
    localStorage.setItem(set_equipo, ++sets_actuales);
    equipo.textContent = sets_actuales.toString();
    localStorage.setItem("minuto_presionado", false)
    alguien_gano(equipo);
    actualizarPuntos()
}

function alguien_gano(t) {
    const sets_equipos = document.querySelectorAll(".sets");
    if (t.textContent >= limite_sets / 2) {
        sets_equipos[0] == t ? alert("the winner team 1") : alert("the winner team 2");
        localStorage.setItem('reloj_activado', false);
        clearTimeout(t);
        mostrar_modal_finalizacion()
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
    //reloj
    reloj.textContent = (hrs > 9 ? hrs : "0" + hrs) +
        ":" + (min > 9 ? min : "0" + min) +
        ":" + (sec > 9 ? sec : "0" + sec);


    if (localStorage.getItem('reloj_activado') != null && reloj_activado == 'true') {
        timer();
    }

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

//minuto
const minuto = document.querySelector('#minuto');

function correr_minuto(event) {
    const modal = document.getElementById("modal-minuto");
    const contenido = document.getElementById("contenido-modal-minuto");
    let minuto_presionado = localStorage.getItem("minuto_presionado") || localStorage.setItem("minuto_presionado", false);

    if (localStorage.getItem("minuto_presionado") == 'false') {
        minuto_presionado = localStorage.setItem("minuto_presionado", true);
        let min = 59;
        modal.style.display = 'block';
        localStorage.setItem('reloj_activado', false);
        clearTimeout(t);
        let tiempo = setInterval(() => {
            contenido.textContent = min;
            min--;
            if (min < 10)
                contenido.style.color = "red";
            else
                contenido.style.color = "black";

            if (min == 0) {
                console.log(min)
                clearTimeout(tiempo);
                modal.style.display = 'none';
                localStorage.setItem('reloj_activado', true);
                timer()
            }
        }, 1000)
        contenido.textContent = '';
    }
}

minuto.addEventListener('click', correr_minuto);
// modal de envio de datos

function mostrar_modal_finalizacion() {
    const modal = document.getElementById('modal-envio');
    const table = document.getElementById('marcador');
    const primera_fila = document.getElementById("primera-columna-marcador");
    const segunda_fila = document.getElementById("segunda-columna-marcador")
    const sets = document.getElementById("sets");
    const tiempo_partido = document.getElementById("tiempo-partido");

    for (let i = 0; i < array_puntos1.length; i++) {
        let row1 = document.createElement('td');
        row1.innerHTML = array_puntos1[i];

        let row2 = document.createElement('td');
        row2.innerHTML = array_puntos2[i];

        primera_fila.appendChild(row1);
        segunda_fila.appendChild(row2);
    }
    localStorage.setItem('reloj_activado', false);
    clearTimeout(t);

    sets.textContent = `${localStorage.getItem(equipo1.sets_ls)}-${localStorage.getItem(equipo2.sets_ls)}`
    tiempo_partido.textContent = reloj.textContent;
    let json = serializar(table, sets, tiempo_partido);
    console.log(json)
    modal.style.display = 'block';
}

//Tarjetas Amarillas
var Amarilla1 = document.getElementById("Amarilla1");
var Amarilla2 = document.getElementById("Amarilla2");

Amarilla1.innerHTML = localStorage.getItem("Amarilla1") || "0";
Amarilla2.innerHTML = localStorage.getItem("Amarilla2") || "0";

function TAmarilla1() {
    Amarilla1.innerHTML = parseInt(Amarilla1.innerHTML) + 1;
    localStorage.setItem("Amarilla1", Amarilla1.innerText);
    if (Amarilla1.innerHTML == 2) {
        contRojo1();

    } else if (Amarilla1.innerHTML > 2) {
        Amarilla1.innerHTML = 0;
        localStorage.setItem("Amarilla1", Amarilla1.innerText);
    }
}

function TAmarilla2() {
    Amarilla2.innerHTML = parseInt(Amarilla2.innerHTML) + 1;
    localStorage.setItem("Amarilla2", Amarilla2.innerText);
    if (Amarilla2.innerHTML == 2) {
        contRojo2();

    } else if (Amarilla2.innerHTML > 2) {
        Amarilla2.innerHTML = 0;
        localStorage.setItem("Amarilla2", Amarilla2.innerText);
    }
}
Amarilla1.addEventListener("click", TAmarilla1);
Amarilla2.addEventListener("click", TAmarilla2);

//Tarjetas Rojas
var Roja1 = document.getElementById("Roja1");
var Roja2 = document.getElementById("Roja2");

Roja1.innerHTML = localStorage.getItem("Roja1") || "0";
Roja2.innerHTML = localStorage.getItem("Roja2") || "0";

function contRojo1() {
    Roja1.innerHTML = parseInt(Roja1.innerHTML) + 1;
    localStorage.setItem("Roja1", Roja1.innerText);
    if (Roja1.innerHTML > 1) {
        Roja1.innerHTML = 0;
        localStorage.setItem("Roja1", Roja1.innerText);
    } else if (Roja1.innerHTML == 1) {
        flecha.style.pointerEvents = "none";
        localStorage.setItem('reloj_activado', false);
        clearTimeout(t);
        reloj.style.pointerEvents = "none";

        equipo1.etiqueta_saque.style.pointerEvents = "none";
        equipo1.etiqueta_puntos.style.pointerEvents = "none";
        Amarilla1.style.pointerEvents = "none";
        Roja1.style.pointerEvents = "none";

        equipo2.etiqueta_puntos.style.pointerEvents = "none";
        equipo2.etiqueta_saque.style.pointerEvents = "none";
        Amarilla2.style.pointerEvents = "none";
        Roja2.style.pointerEvents = "none";
    }
    mostrar_modal_finalizacion();
}

function contRojo2() {
    Roja2.innerHTML = parseInt(Roja2.innerHTML) + 1;
    localStorage.setItem("Roja2", Roja2.innerText);
    if (Roja2.innerHTML > 1) {
        Roja2.innerHTML = 0;
        localStorage.setItem("Roja2", Roja2.innerText);
    } else if (Roja2.innerHTML == 1) {
        flecha.style.pointerEvents = "none";
        localStorage.setItem('reloj_activado', false);
        clearTimeout(t);
        reloj.style.pointerEvents = "none";

        equipo1.etiqueta_saque.style.pointerEvents = "none";
        equipo1.etiqueta_puntos.style.pointerEvents = "none";
        Amarilla1.style.pointerEvents = "none";
        Roja1.style.pointerEvents = "none";

        equipo2.etiqueta_puntos.style.pointerEvents = "none";
        equipo2.etiqueta_saque.style.pointerEvents = "none";
        Amarilla2.style.pointerEvents = "none";
        Roja2.style.pointerEvents = "none";
    }
    mostrar_modal_finalizacion();
}
Roja1.addEventListener("click", contRojo1);
Roja2.addEventListener("click", contRojo2);

//Ventana Modal
const popup = document.querySelector('.popup');


window.addEventListener('load', () => {
    popup.classList.add('showPopup');
    popup.childNodes[1].classList.add('showPopup');
})

//Primer saque
var btnSaque = document.getElementById("btnSaque");
var auxPrimerSaque = 0;

function primerSaque() {
    if (document.getElementById("inputEquipo1").checked) {
        auxPrimerSaque = 1;
        ocultar2();
    } else if (document.getElementById("inputEquipo2").checked) {
        auxPrimerSaque = 2;
        ocultar1();
    } else {
        localStorage.clear();
        location.reload();
    }
    popup.classList.remove('showPopup');
    popup.childNodes[1].classList.remove('showPopup');
    popup.style.display = 'none'
}

function ocultar1() {
    document.getElementById('saque1').style.display = 'none';
    document.getElementById('saque2').style.display = 'block';
}

function ocultar2() {
    document.getElementById('saque2').style.display = 'none';
    document.getElementById('saque1').style.display = 'block';
}
btnSaque.addEventListener("click", primerSaque);