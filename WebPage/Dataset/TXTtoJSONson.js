const fs = require('fs')

let data = fs.readFileSync('./Input/math-graph.txt', 'utf-8');
const lines = data.split(/\r?\n/);
let graph = {
    'nodes': [],
    'links': []
}
let archi = false
lines.forEach((row) => {
    if (row.length == 0)
        return
    if (row == '2277')
        return
    if (row == '2554') {
        archi = true
        return
    }
    if (!archi) {
        let [id, discendenti, ...nome] = row.split(' ')
        const nodo = {
            'id': id,
            'discendenti': discendenti,
            'name': nome.join(' ')

        }
        graph.nodes.push(nodo)
    }else {
        let [source, target, year, country] = row.split(' ')

        const arco = {
            'source': source,
            'target': target,
            'year': year,
            'country': country
        }
        graph.links.push(arco)
    }
})

//console.log(graph)

let jsonContent = JSON.stringify(graph);

fs.writeFileSync('./Output/graph.json', jsonContent,'utf-8');