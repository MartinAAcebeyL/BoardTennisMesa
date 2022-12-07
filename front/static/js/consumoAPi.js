const base_url = 'http://localhost:3000/';

const imgs = document.querySelectorAll('.img-equipo');
const nombre_equipos = document.querySelectorAll('.nombre-equipo');
const nombre_equipo_modal = document.querySelectorAll('.nombre_equipo_modal');
async function getData() {
    try {
        let response = await fetch(base_url + '1');
        let json = await response.json();
        const imgs_envio = document.querySelectorAll('.img-equipo-envio');
        const nombres_envio = document.querySelectorAll('.nombre-equipo-envio');

        for (let i = 0; i < imgs.length; i++) {
            imgs[i].src = `${json.equipos[i]['imagen_pais']}`;
            nombre_equipos[i].textContent = json.equipos[i]['equipo'];

            nombre_equipo_modal[i].textContent = json.equipos[i]['equipo'];
            //envio
            imgs_envio[i].src = `${json.equipos[i]['imagen_pais']}`;
            nombres_envio[i].textContent = json.equipos[i]['nombre'] + " " + json.equipos[i]['apellido'];
        }

        return json.sets;
    } catch (error) {
        console.log(error);
    }
}

export let sets = await getData();