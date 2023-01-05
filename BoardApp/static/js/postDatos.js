function serializar(table, sets, tiempo_partido) {
    const tds = table.getElementsByTagName('td');
    const targetas1 = document.getElementById('footer1');
    const targetas2 = document.getElementById('footer2');
    let array_tds = to_array(tds);
    let array_sets = sets.textContent.split("-")
    let mitad = Math.floor(array_tds.length / 2);

    let team1 = array_tds.slice(0, mitad);
    let team2 = array_tds.slice(mitad);
    let json1 = jsons(team1, array_sets, targetas1);
    let json2 = jsons(team2, array_sets, targetas2);

    return {
        "team1": json1,
        "team2": json2,
        "tiempo": tiempo_partido.textContent
    }
}

function jsons(team, array_sets, targetas) {
    return {
        "bandera": team[0].getElementsByTagName('img')[0].src,
        "nombre": team[1].textContent,
        "puntos": to_array_text(to_array(team.slice(2))),
        "sets": array_sets[0],
        "targetas": {
            "amarrillas": targetas.children[1].textContent,
            "rojas": targetas.children[0].textContent,
        }
    }
}

function to_array(html_array) {
    let array = [];
    for (let i = 0; i < html_array.length; i++)
        array.push(html_array[i])
    return array;
}

function to_array_text(array) {
    let aux = [];
    for (let i = 0; i < array.length; i++)
        aux.push(array[i].textContent)
    return aux;
}

function post(json) {
    const url = "https://pingpongteam2-fc24c-default-rtdb.firebaseio.com/resultados.json"
    fetch(url, {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(response => response.json())
        .catch(error => console.log(error));
}

export { serializar, post };