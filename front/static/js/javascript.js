// const $tiempoTranscurrido = document.querySelector("#tiempoTranscurrido"),
//     $btnIniciar = document.querySelector("#btnIniciar"),
//     $btnPausar = document.querySelector("#btnPausar"),
//     $contenedorMarcas = document.querySelector("#contenedorMarcas");
// let marcas = [],
//     idInterval,
//     tiempoInicio = null;
// let diferenciaTemporal = 0;

// const ocultarElemento = elemento => {
//     elemento.style.display = "none";
// }

// const mostrarElemento = elemento => {
//     elemento.style.display = "";
// }

// const agregarCeroSiEsNecesario = valor => {
//     if (valor < 10) {
//         return "0" + valor;
//     } else {
//         return "" + valor;
//     }
// }

// const milisegundosAMinutosYSegundos = (milisegundos) => {
//     const minutos = parseInt(milisegundos / 1000 / 60);
//     milisegundos -= minutos * 60 * 1000;
//     segundos = (milisegundos / 1000);
//     return `${agregarCeroSiEsNecesario(minutos)}:${agregarCeroSiEsNecesario(segundos.toFixed(1))}`;
// };


// const iniciar = () => {
//     const ahora = new Date();
//     tiempoInicio = new Date(ahora.getTime() - diferenciaTemporal);
//     clearInterval(idInterval);
//     idInterval = setInterval(refrescarTiempo, 100);
//     ocultarElemento($btnIniciar);
//     mostrarElemento($btnPausar);
// };
// const pausar = () => {
//     diferenciaTemporal = new Date() - tiempoInicio.getTime();
//     clearInterval(idInterval);
//     mostrarElemento($btnIniciar);
//     ocultarElemento($btnPausar);
// };
// const refrescarTiempo = () => {
//     const ahora = new Date();
//     const diferencia = ahora.getTime() - tiempoInicio.getTime();
//     $tiempoTranscurrido.textContent = milisegundosAMinutosYSegundos(diferencia);
// };


// const init = () => {
//     $tiempoTranscurrido.textContent = "00:00.0";
//     ocultarElemento($btnPausar);
// };
// init();

// $btnIniciar.onclick = iniciar;
// $btnPausar.onclick = pausar;
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