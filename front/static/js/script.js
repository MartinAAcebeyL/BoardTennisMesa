const reloj = document.querySelector("#reloj");

let reloj_activado = false;

let hrs = 0;//localStorage.getItem("hrs");
let min = 0;//localStorage.getItem("min");
let sec = 0;//localStorage.getItem("sec");
var t;

reloj.addEventListener('click', () => {
    reloj_activado = !reloj_activado;
    if (reloj_activado)
        timer()
    else {
        clearTimeout(t)
        // hrs = localStorage.getItem("hrs");
        // min = localStorage.getItem("min");
        // sec = localStorage.getItem("sec");
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