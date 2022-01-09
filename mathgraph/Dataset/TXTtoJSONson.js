/**
 * Script per convertire il dataset da TXT con separatore new line in JSON
 */
const fs = require('fs');

let data = fs.readFileSync('./Input/math-graph.txt', 'utf-8');
const lines = data.split(/\r?\n/);
/**
 * Il grafo deve essere formato da nodi e link con alcuni attributi essenziali come ID , source e target. 
 * Procediamo con la creazione struttura JSON
 */
let graph = {    
    'nodes': [],
    'links': []
}
let archi = false;
lines.forEach((row) => {
    if (row.length == 0)
        return;
    if (row == '2277')
        return;
    if (row == '2554') {
        archi = true;
        return;
    }
    if (!archi) {
        let [id, discendenti, ...nome] = row.split(' ')
        const nodo = {
            'id': id,
            'discendenti': discendenti,
            'name': nome.join(' ')

        }
        graph.nodes.push(nodo);
    }else {
        let [source, target, year, country] = row.split(' ')

        const arco = {
            'source': source,
            'target': target,
            'year': year,
            'country': country
        }
        graph.links.push(arco);
    }
})
/**
 * Aggiorno i discendenti dei nodi con il grado di questa partizione
 */
let deg = {}
for (let x of graph.links) {
   if (deg[x.source])
        deg[x.source] += 1
    else 
        deg[x.source] = 1
}
for (let y of graph.nodes) {
    y.discendenti = (deg[y.id] !== undefined) ? deg[y.id] : 0
}

/**
 * Salvo il grafo ricavato in un file .json
 */
 let jsonContent = JSON.stringify(graph);
 fs.writeFileSync('./Output/graph.json', jsonContent,'utf-8');

