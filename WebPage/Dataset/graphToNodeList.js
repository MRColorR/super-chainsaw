//carico il grafo in JSON
//provo con indice 18331

function addRoot(idRoot) {
    const nodeList = {
        'name' : idRoot,
        'children' : []
    }
    return nodeList;
}

function addNode(id, graph) {
    for (let i = 0; i < graph.nodes.length; i++) {
        const element = graph.nodes[i];
        let newNode = undefined;
        if (element.id == id) {
            if (element.discendenti != 0) {
                newNode = {
                    name: id,
                    id: element.name,
                    value: element.discendenti,
                    children: []
                }
            }
            return newNode;
        }
    }
}

function getAllChildren(id, graph) {
    const arr = [];
    for (let i = 0; i < graph.links.length; i++) {
        const element = graph.links[i];
        if (id == element.source) {
            let newNode = addNode(element.target, graph);
            if (newNode != undefined)
                arr.push(newNode);
        }
    }
    return arr;
}

function convertgraph(nodo, graph) {
    const nodiDaAggiungere = getAllChildren(nodo.name, graph);
    if (nodiDaAggiungere.length == 0)
        return;
    else {
        nodo.children = nodiDaAggiungere;
        for (let index = 0; index < nodo.children.length; index++) {
            convertgraph(nodo.children[index], graph);
        }
    }
}

function removeValue(nodo) {
    if (nodo['children'].length == 0) {
        return;
    }else {
        delete nodo['value'];
        for (const n of nodo.children) {
            removeValue(n);
        }
    }
}

export function findDegNodes(graph) {
    let degNodes = graph.links.reduce( (obj, edge) => {
        if (obj[edge.source] != undefined) {
            obj[edge.source] += 1;
        } else {
            obj[edge.source] = 1;
        }
        return obj;
    }, {});
    //ordine decrescente rispetto al grado.
    let sortedDegNodes = Object.entries(degNodes).sort( ([,a], [,b]) => b-a);
    return sortedDegNodes;
}

export function createNodeList(graph, idRoot) {
    const nodeList = addRoot(idRoot);
    convertgraph(nodeList,graph);
    removeValue(nodeList);
    return nodeList;
}
function main () {
    const idRoot = '18331';
    const fs = require('fs');
    const graph = JSON.parse(fs.readFileSync('./Output/graph.json', 'utf-8'));
    console.log(graph);
    const nodeList = addRoot(idRoot);
    convertgraph(nodeList, graph);
    removeValue(nodeList, graph);
    fs.writeFileSync('./Output/graphNodeList.json', JSON.stringify(nodeList));
    fs.writeFileSync('./Output/graphOutDeg.json', JSON.stringify(degNode));
}
if (typeof module != 'undefined' && !module.main) 
    main(); 