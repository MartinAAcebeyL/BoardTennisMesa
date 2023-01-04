import { sets } from './consumoAPi.js';
import {
    _equipo1 as equipo1,
    _equipo2 as equipo2,
} from './factory.js';
import {
    post,
    serializar,
} from './postDatos.js';

//varios
let limite_puntos = 11;
let cantidad_saques = 1;
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
    console.log("aux_cambio_saque: " + aux_cambio_saque);
    let puntos_actuales;

    if (equipo1.etiqueta_puntos == event.target) {
        puntos_actuales = parseInt(localStorage.getItem(equipo1.puntos_ls));
        localStorage.setItem(equipo1.puntos_ls, ++puntos_actuales);
        ultimo_juego = equipo1;
        retrocedio_puntos_equipo1 = false;
        //socket para aumentar puntos al equipo 1
        socket.emit('puntos', "1:" + localStorage.getItem(equipo1.puntos_ls));
    } else {
        puntos_actuales = parseInt(localStorage.getItem(equipo2.puntos_ls));
        localStorage.setItem(equipo2.puntos_ls, ++puntos_actuales);
        ultimo_juego = equipo2;
        retrocedio_puntos_equipo2 = false;
        //socket para aumentar puntos al equipo 2
        socket.emit('puntos', "2:" + localStorage.getItem(equipo2.puntos_ls));
    }
    this.textContent = puntos_actuales.toString();

    let cambiar_limite_puntos = equipo1.etiqueta_puntos.textContent == limite_puntos - 1 && equipo2.etiqueta_puntos.textContent == limite_puntos - 1;

    if (cambiar_limite_puntos) {
        limite_puntos = parseInt(equipo1.etiqueta_puntos.textContent) + 2;
    }
    if (aux_cambio_saque) {
        aux_cambio_saque = false;
    }

    console.log("cantidad saques: " + cantidad_saques);
    console.log("\n");

    sumarSets(this);
    saquePartido();
}

function actualizarPuntosA0() {
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
        array_puntos1.push(localStorage.getItem(equipo1.puntos_ls));
        array_puntos2.push(localStorage.getItem(equipo2.puntos_ls));
        if (t == equipo1.etiqueta_puntos) {
            actualiar_set(equipo1.sets_ls, equipo1.etiqueta_sets);
            //si el equipo 1 no ha ganado el partido se envia mensaje por socket
            if (!(equipo1.etiqueta_sets.textContent >= limite_sets / 2))
                socket.emit('set', "1:" + localStorage.getItem('sets-equipo-1'));
        } else {
            actualiar_set(equipo2.sets_ls, equipo2.etiqueta_sets);
            //si el equipo 1 no ha ganado el partido se envia mensaje por socket
            if (!(equipo2.etiqueta_sets.textContent >= limite_sets / 2))
                socket.emit('set', "2:" + localStorage.getItem('sets-equipo-2'));
        }
        ultimo_juego = null;
        //si se cambia de sets, se vuelve a mostrar para pedir minuto
        minuto.forEach(el => el.style.display = "block");
    }
}

function actualiar_set(set_equipo, equipo) {
    let sets_actuales = parseInt(localStorage.getItem(set_equipo));
    localStorage.setItem(set_equipo, ++sets_actuales);
    equipo.textContent = sets_actuales.toString();
    alguien_gano(equipo);
    actualizarPuntosA0();
    set_saque();
    cantidad_saques = 0;
}

function alguien_gano(t) {
    if (t.textContent >= limite_sets / 2) {
        localStorage.setItem('reloj_activado', false);
        clearTimeout(t);
        mostrar_modal_finalizacion();
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
const atras = document.querySelectorAll(".atras")

let retrocedio_puntos_equipo1 = false;
let retrocedio_puntos_equipo2 = false;

function retroceder_puntos(event) {
    let puntos_equipo1 = parseInt(localStorage.getItem(equipo1.puntos_ls));
    let puntos_equipo2 = parseInt(localStorage.getItem(equipo2.puntos_ls));
    if (aux_cambio_saque == true && !(puntos_equipo1 >= 10 && puntos_equipo2 >= 10)) {
        console.log("cambio de saque")
        let paraCambiar = ultimo_juego.nombre.split("-")[1];
        if (paraCambiar == "1") {
            ocultar_saque_equipo(1);
            equipo_saca = 2;
        } else {
            ocultar_saque_equipo(2);
            equipo_saca = 1;
        }

        cantidad_saques = 2;
        let aux = ultimo_juego.etiqueta_puntos.textContent--;
        localStorage.setItem(ultimo_juego.puntos_ls, --aux);
        return;
    }
    if (puntos_equipo1 >= 10 && puntos_equipo2 >= 10) {
        if (this == atras[0]) {
            ocultar_saque_equipo(1);
            let aux = equipo1.etiqueta_puntos.textContent--;
            localStorage.setItem(equipo1.puntos_ls, --aux);
            equipo_saca = 1;
        } else {
            ocultar_saque_equipo(2);
            let aux = equipo2.etiqueta_puntos.textContent--;
            localStorage.setItem(equipo2.puntos_ls, --aux);
            equipo_saca = 2;
        }
    } else {
        if (puntos_equipo1 > 0 && this == atras[0] && !retrocedio_puntos_equipo1) {
            let aux = equipo1.etiqueta_puntos.textContent--;
            localStorage.setItem(equipo1.puntos_ls, --aux);
            cantidad_saques--;
            retrocedio_puntos_equipo1 = true;
        }

        if (puntos_equipo2 > 0 && this == atras[1] && !retrocedio_puntos_equipo2) {
            let aux = equipo2.etiqueta_puntos.textContent--;
            localStorage.setItem(equipo2.puntos_ls, --aux);
            cantidad_saques--;
            retrocedio_puntos_equipo2 = true;
        }
    }
    ultimo_juego = null;
}

atras.forEach(el => el.addEventListener('click', retroceder_puntos));
//devolver saque
const devolver_saque = document.querySelectorAll(".devolver_saque");
function devolver_saque_equipo(event) {
    console.log("devoler saque")
    if (this == devolver_saque[0]) {
        ocultar_saque_equipo(1);
        equipo_saca = 2;
    } else {
        ocultar_saque_equipo(2);
        equipo_saca = 1;
    }
    cantidad_saques = 3;
    aux_cambio_saque = false;
    ultimo_juego = null;
}

devolver_saque.forEach(el => el.addEventListener('click', devolver_saque_equipo));
//minuto
const minuto = document.querySelectorAll('.minuto');

function correr_minuto(event) {
    const modal = document.getElementById("modal-minuto");
    const contenido = document.getElementById("contenido-modal-minuto");

    let min = 5;
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
            clearTimeout(tiempo);
            modal.style.display = 'none';
            localStorage.setItem('reloj_activado', true);
            timer()
        }
    }, 1000)
    contenido.textContent = '';
    this.style.display = 'none';
}
minuto.forEach(el => el.addEventListener('click', correr_minuto));

// modal de envio de datos
function mostrar_modal_finalizacion() {
    const modal = document.getElementById('modal-envio');
    const primera_fila = document.getElementById("primera-columna-marcador");
    const sets = document.getElementById("sets");
    const segunda_fila = document.getElementById("segunda-columna-marcador")
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

    modal.style.display = 'block';
}

//post de datos
const bnt_envio = document.getElementById('btn-envio');

function post_resultado() {
    const table = document.getElementById('marcador');
    const sets = document.getElementById("sets");
    const tiempo_partido = document.getElementById("tiempo-partido");


    let json = serializar(table, sets, tiempo_partido);
    while (localStorage.length > 0) {
        localStorage.clear()
    }
    post(json)
}

bnt_envio.addEventListener('click', post_resultado);

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
var equipo_saca = 0;
var ultimoSaque = 0;

function primerSaque() {
    document.getElementById("inputEquipo1").checked ? equipo_saca = 1 : equipo_saca = 2;
    ultimoSaque = equipo_saca;

    popup.classList.remove('showPopup');
    popup.childNodes[1].classList.remove('showPopup');
    popup.style.display = 'none'

    equipo_saca == 1 ? ocultar_saque_equipo(2) : ocultar_saque_equipo(1);
}

function ocultar_saque_equipo(equipo) {
    let puntos_equipo1 = parseInt(localStorage.getItem(equipo1.puntos_ls));
    let puntos_equipo2 = parseInt(localStorage.getItem(equipo2.puntos_ls));

    if (equipo == 1) {
        document.getElementById('saque1').style.display = 'none';
        document.getElementById('saque2').style.display = 'block';
        socket.emit('saque', "saca:2");
    } else {
        document.getElementById('saque2').style.display = 'none';
        document.getElementById('saque1').style.display = 'block';
        socket.emit('saque', "saca:1");
    }
    if (puntos_equipo2 > 0 || puntos_equipo1 > 0)
        aux_cambio_saque = true;
}
btnSaque.addEventListener("click", primerSaque);
let aux_cambio_saque = false;

//saque Partido
function saque_ambos_pts_mayor_10() {
    if (equipo1.etiqueta_puntos.textContent == 10 &&
        equipo2.etiqueta_puntos.textContent == 10) {
        if (equipo_saca == 1) {
            ocultar_saque_equipo(2);
            equipo_saca = 2;
        } else {
            ocultar_saque_equipo(1);
            equipo_saca = 1;
        }
    }

    if (equipo_saca == 1) {
        ocultar_saque_equipo(2);
        equipo_saca = 2;
    } else {
        ocultar_saque_equipo(1);
        equipo_saca = 1;
    }
}

function saque_ambos_pts_menor_10() {
    if (equipo_saca == 1 && cantidad_saques > 2) {
        ocultar_saque_equipo(1);
        equipo_saca = 2;
        cantidad_saques = 1;
    }

    if (equipo_saca == 2 && cantidad_saques > 2) {
        ocultar_saque_equipo(2);
        equipo_saca = 1;
        cantidad_saques = 1;
    }
}

function saquePartido() {
    let pts_ambos_equipos_mayores_10 = equipo1.etiqueta_puntos.textContent >= 10 &&
        equipo2.etiqueta_puntos.textContent >= 10

    if (pts_ambos_equipos_mayores_10) {
        saque_ambos_pts_mayor_10();
    } else {
        cantidad_saques++;
        saque_ambos_pts_menor_10();
    }
}

function set_saque() {
    ultimoSaque == 1 ? equipo_saca = 2 : equipo_saca = 1;
    ultimoSaque = equipo_saca;
    equipo_saca == 1 ? ocultar_saque_equipo(2) : ocultar_saque_equipo(1);
}

//websockets
var socket = io();

socket.on('connect', function () {
    const nombres = document.querySelectorAll(".nombre-equipo");
    const banderas = document.querySelectorAll(".img-equipo");
    let json = construir_json_sockets(nombres, banderas);

    socket.emit('inicio', json);
});

function construir_json_sockets(nombres, banderas) {
    let json = {};
    for (let i = 0; i < nombres.length; i++) {
        json[i] = {
            nombre: nombres[i].textContent,
            bandera: banderas[i].src
        };
    }
    return json;
}