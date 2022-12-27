const equipo1 = document.querySelector('#equipo1');
const equipo2 = document.querySelector('#equipo2');

const header1 = equipo1.children[0].children;
const header2 = equipo2.children[0].children;

const puntos1 = equipo1.children[1];
const puntos2 = equipo2.children[1];

const saque1 = equipo1.children[2];
const saque2 = equipo2.children[2];

function factory(nombre, etiqueta_puntos, etiqueta_sets, etiqueta_nombre, etiqueta_saque) {
    return {
        nombre,
        etiqueta_puntos,
        etiqueta_sets,
        etiqueta_nombre,
        etiqueta_saque,
        ultimo_juego: false,
        puntos_ls: "puntos-" + nombre,
        sets_ls: "sets-" + nombre
    }
}

export let _equipo1 = factory("equipo-1", puntos1, header1[1], header1[0], saque1);
export let _equipo2 = factory("equipo-2", puntos2, header2[1], header2[0], saque2);