const base_url = 'http://localhost:3000/';

const equipos = document.querySelectorAll('.equipos');
const equipo1 = document.querySelector('#equipo1');
const equipo2 = document.querySelector('#equipo2');

async function getData() {
    try {
        let response = await fetch(base_url + '2');
        let json = await response.json();

        for (let i = 0; i < equipos.length; i++)
            equipos[i].style.backgroundImage = `url(${json.equipos[i]['imagen_pais']})`;

        equipo1.children[0].children[0].textContent = json.equipos[0]['equipo'];
        equipo2.children[0].children[0].textContent = json.equipos[1]['equipo'];
        document.getElementById('catidad_sets').textContent = json.sets;
        return json.sets;
    } catch (error) {
        console.error(error);
    }
}

export let sets = await getData();