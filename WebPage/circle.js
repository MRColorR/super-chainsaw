import {findDegNodes,createNodeList} from './Dataset/graphToNodeList.js'

let nodesDeg, graph = undefined;

function showGraph(event) {
    d3.select('#chart').selectAll('*').remove();
    const nodeList = createNodeList(graph, event.currentTarget.value);
    
    const color = d3.scaleOrdinal(d3.schemePaired);
    Sunburst()
        .data(nodeList)
        .color(d => color(d.name))
        .minSliceAngle(.4)
        .maxLevels(6)
        .showLabels(false)
        .tooltipContent((d, node) => `Size: <i>${node.value}</i>`)
    (document.getElementById('chart'));
    
}

const div = d3.select('#option-wrapper');
div.append('label').attr('for', 'nodeSelection').text('seleziona un nodo');
const menu = div.append('select').attr('name', 'nodeSelection').attr('id', 'nodeSelection').on('change', showGraph);

fetch('./Dataset/Output/graph.json').then(res => res.json()).then(data => {
    graph = data;
    nodesDeg = findDegNodes(data);
    const limit = 5;
    for (let v in nodesDeg) {
        if (v >= limit)
            break;
        menu.append('option').attr('name', nodesDeg[v][0]).text(nodesDeg[v][0]);
    }
});
