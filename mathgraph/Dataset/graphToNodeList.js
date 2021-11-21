
/**
 * 
 * @param {String} idRoot Id della radice da cui partire
 * @param {Array} graph rappresentazione del grafo
 * @returns lista inizializzata
 * Inizializzo la lista partendo dalla radice
 */
function addRoot(idRoot, graph) {
    let root = addNode(idRoot, graph);
    const nodeList = {
        'name' : root.name,
        'id' : root.id, 
        'children' : []
    }
    return nodeList;
}

/**
 * 
 * @param {String} id Id del nodo
 * @param {Array} graph Rappresentazione del grafo
 * @returns nodo corrispondente all' id.
 */
function addNode(id, graph) {
    for (let i = 0; i < graph.nodes.length; i++) {
        const element = graph.nodes[i];
        let newNode = undefined;
        if (element.id == id) {
            if (element.discendenti != 0) {
                newNode = {
                    name: id,
                    id: editName(element.name),
                    value: element.discendenti,
                    children: []
                }
            }
            return newNode;
        }
    }
}
/**
 * 
 * @param {String} name 
 * Rimuovo parti del nome per renderlo più corto.
 */
function editName(name) {
    return name.replace(/\(([^()]+)\)/g, "");
}
/**
 * 
 * @param {String} id Id del nodo
 * @param {Array} graph Rappresentazione del grafo
 * @returns array contenente i vicini di un nodo.
 */
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
/**
 * 
 * @param {Array} nodo Radice dell'albero
 * @param {*} graph rappresentazione del grafo
 * @returns Lista di nodi partendo dalla radice
 * Funzione ricorsiva che fa una DFS per cercare tutti i 'discendenti' della radice.
 */
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
/**
 * 
 * @param {Array} nodo 
 * @returns vado a rimuovore il numero dei disceneti in tutta lista ma non nelle foglie.
 */
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

/**
 * 
 * @param {Array} graph Rappresentazione del grafo
 * @returns Array contente id e grado uscente.
 */
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
/**
 * 
 * @param {Array} graph Rappresentazione del grafo
 * @param {String} idRoot Id radice
 * @returns Lista contente il nodo radice e tutti i sui discendenti.
 */
export function createNodeList(graph, idRoot) {
    const nodeList = addRoot(idRoot, graph);
    convertgraph(nodeList, graph);
    removeValue(nodeList);
    return nodeList;
}

function main () {
    const idRoot = '18331';
    const fs = require('fs');
    const graph = JSON.parse(fs.readFileSync('./Output/graph.json', 'utf-8'));
    const nodeList = addRoot(idRoot, graph);
    convertgraph(nodeList, graph);
    removeValue(nodeList, graph);
    fs.writeFileSync('./Output/graphNodeList.json', JSON.stringify(nodeList));
    //fs.writeFileSync('./Output/graphOutDeg.json', JSON.stringify(degNode));
}
if (typeof module != 'undefined' && !module.main) 
    main(); 