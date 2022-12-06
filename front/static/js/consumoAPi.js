const base_url = 'http://localhost:3000/';

const imgs = document.querySelectorAll('.img-equipo');
const nombre_equipos = document.querySelectorAll('.nombre-equipo');
const nombre_equipo_modal = document.querySelectorAll('.nombre_equipo_modal');
async function getData() {
    try {
        let response = await fetch(base_url + '2');
        let json = await response.json();

        for (let i = 0; i < imgs.length; i++) {
            imgs[i].src = `${json.equipos[i]['imagen_pais']}`;
            nombre_equipos[i].textContent = json.equipos[i]['equipo'];
            nombre_equipo_modal[i].textContent = json.equipos[i]['equipo'];
        }

        document.getElementById('catidad_sets').textContent = json.sets;
        return json.sets;
    } catch (error) {
        console.error(error);
    }
}

export let sets = await getData();