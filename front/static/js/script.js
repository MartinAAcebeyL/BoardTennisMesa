//reloj
const reloj = document.querySelector("#reloj");

let reloj_activado = false;
let inicia_partido = false;

let hrs = 0;
let min = 0;
let sec = 0;
var t;

reloj.addEventListener('click', () => {
    reloj_activado = !reloj_activado;

    if (reloj_activado && !inicia_partido) {
        localStorage.setItem("puntos-equipo-1", 0);
        localStorage.setItem("puntos-equipo-2", 0);
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

const equipos = document.querySelectorAll(".puntos");

function sumarPuntos(event) {
    let puntos_actuales;
    if (equipos[0] == event.target){
        puntos_actuales = parseInt(localStorage.getItem("puntos-equipo-1"));
        localStorage.setItem("puntos-equipo-1", ++puntos_actuales);
    }else{
        puntos_actuales = parseInt(localStorage.getItem("puntos-equipo-2"));
        localStorage.setItem("puntos-equipo-2", ++puntos_actuales);
    }

    this.textContent = puntos_actuales.toString();
}

equipos.forEach(el => el.addEventListener(
    'click', sumarPuntos
));

// general
//local storage
if (localStorage.length>0){
    equipos[0].textContent = parseInt(localStorage.getItem("puntos-equipo-1"));
    equipos[1].textContent = parseInt(localStorage.getItem("puntos-equipo-2"));
}