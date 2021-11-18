import {findDegNodes,createNodeList} from './Dataset/graphToNodeList.js'

let nodesDeg, graph = undefined;

window.onload = () => {
    const div = d3.select('#option-wrapper');
    div.append('label').attr('for', 'nodeSelection').text('seleziona un nodo');
    const menu = div.append('select').attr('name', 'nodeSelection').attr('id', 'nodeSelection').on('change', changeGraph);

    fetch('./Dataset/Output/graph.json').then(res => res.json()).then(data => {
        graph = data;
        nodesDeg = findDegNodes(data);
        const limit = 5;
        for (let v in nodesDeg) {
            if (v >= limit)
                break;
            menu.append('option').attr('name', nodesDeg[v][0]).text(nodesDeg[v][0]);
        }
    }).finally( () => {
        showGraph();
    })
}

function showGraph(id) {
    let idMaxDeg = nodesDeg[0]
    idMaxDeg = idMaxDeg[0]

    id = (id == undefined) ? idMaxDeg : id;
    d3.select('#chart').selectAll('*').remove();
    const nodeList = createNodeList(graph, id);
    const color = d3.scaleOrdinal(d3.schemePaired);
    Sunburst()
        .data(nodeList)
        .color(d => color(d.name))
        .label( d => d.id )
        .showLabels(true)
        .tooltipContent((d, node) => {
            return `Size: <i>${node.value}</i>`;
        })
    (document.getElementById('chart'));
}



function changeGraph(event) {
      let index = event.target.value;
      showGraph(index);
}