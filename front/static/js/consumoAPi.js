const base_url = 'http://localhost:3000/';

const imgs = document.querySelectorAll('.img-equipo');

const nombre_equipos = document.querySelectorAll('.nombre-equipo');
async function getData() {
    try {
        let response = await fetch(base_url + '1');
        let json = await response.json();

        for (let i = 0; i < imgs.length; i++) {
            imgs[i].src = `${json.equipos[i]['imagen_pais']}`;
            nombre_equipos[i].textContent = json.equipos[i]['equipo'];
        }

        // document.getElementById('catidad_sets').textContent = json.sets;
        return json.sets;
    } catch (error) {
        console.log(error);
    }
}

export let sets = await getData();