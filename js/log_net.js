
let svg = d3.select("#network"),
    width = + svg.attr("width"),
    height = + svg.attr("height"),
    highlight_color = "#fd0000",
    default_stroke_width = 2,
    default_stroke_color = "#aaa",
    default_stroke_opacity = 0.3,
    default_text_size = "15px",
    margin = {top: 50, right: 20, bottom: 80, left: 20},
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 var tooltip = d3.select("body")
                .append('div')
                .attr('class', 'tooltip')
                .attr("fill","#54278f" ) ;


  tooltip.append('div')
         .attr('class', 'programa');
 var size =d3.scaleLog().range([1,10]) // escala de la linea

function load_network(file)
{
    d3.json(file, function(error, graph)
                  {
                      let nodes = graph.nodes;

                      let links = graph.links;

                        r = d3.scaleSqrt()
                            .domain([1,30])
                            .range([6, 20]);

                 var dragDrop = d3.drag().on('start', function (node) {
                            node.fx = node.x
                            node.fy = node.y
                          }).on('drag', function (node) {
                            simulation.alphaTarget(1).restart()
                            node.fx = d3.event.x
                            node.fy = d3.event.y
                          }).on('end', function (node) {
                            if (!d3.event.active) {
                              simulation.alphaTarget(0)
                            }
                            node.fx = null
                            node.fy = null
                          });

                   size.domain(d3.extent(nodes,(d)=>{return d.volume}))

                          const simulation = d3.forceSimulation()
                                               .velocityDecay(0.5)
                                               .force("links",d3.forceLink().id(function(d){return d.Nombre}).distance(10))
                                               //.force("links",d3.forceLink().id((d) => d.name))
                                               .force("charge",d3.forceManyBody().strength(-150))
                                               .force("collide",d3.forceCollide(-5))
                                               .force("center",d3.forceCenter(width/2,height/2));


                           let selLinks = svg.selectAll("g")
                                              .data(links)
                                              .enter()
                                              .append("line")
                                              .attr("class", "link")
                                              .attr("stroke", "#aaa")
                                              .attr("opacity", 0.5);

                             let selNodes = svg.selectAll("g")
                                                .data(nodes)
                                                .enter()
                                                .append("circle")
                                                .attr("class", "nodes")
                                                .style("fill", function(d){
                                                       if (d.grupo == "Programa")
                                                                { return "#2c7fb8" ;}
                                                       else
                                                            {return "#d95f0e" ;}})
                                                .attr("r",function(d){
                                                       if (d.grupo == "Programa")
                                                                { return r(d.inscritos) ;}
                                                       else
                                                            {return 3 ;}})
                                                .call(dragDrop)
                                                .on('mouseover', function(d) {
                                                      tooltip.select('.programa').html("<b> Programa: " + d.Nombre  + "</b>");
                                                      tooltip.style('display', 'block');
                                                      tooltip.style('opacity',2)
                                                 })
                                                 .on('mousemove', function(d) {

                                                              tooltip.style('top', (d3.event.layerY + 10) + 'px')
                                                              .style('left', (d3.event.layerX - 25) + 'px');
                                                })
                                                .on('mouseout', function(d) {
                                                              tooltip.style('display', 'none');
                                                              tooltip.style('opacity',0)
                                                });

                                selNodes.append("title")
                                        .text(function(d)
                                              {
                                                if (d.grupo == "Programa")
                                                {
                                                    return d.Nombre+" - "+"inscritos: "+d.inscritos;
                                                }
                                                else
                                                {
                                                    return d.Nombre;
                                                }
                                              })

                          var text = g.selectAll(".text")
                            .data(selNodes)
                            .enter().append("text")
                                .attr("dy", ".35em")
                                .style("font-size", default_text_size)
                                .text(function(d) {

                                if (d.grupo == "Programa") {
                                    return d.Nombre;
                                } else {
                                    return "";
                                    }
                                });

                            selNodes.merge(selNodes)
                                .on("mouseover", function(d) {  set_highlight(d); })
                                .on("mouseout", function() { exit_highlight(); });


                                function set_highlight(d)
                                {
                                    svg.style("cursor","pointer");

                                    selLinks
                                        .style("stroke", function(o) {
                                        return o.source.Nombre == d.Nombre || o.target.Nombre == d.Nombre ? highlight_color : default_stroke_color;})
                                        .attr("opacity",50)
                                }

                                function exit_highlight()
                                {
                                    svg.style("cursor","default");

                                    selLinks
                                        .attr("stroke-width", 1)
                                        .style("stroke", "#aaa")
                                        .attr("opacity",0.5);
                                }


                             simulation.nodes(nodes).on("tick", ticked);
                             simulation.force("links").links(links);
                             simulation.force("collide").radius((d)=>{return size(d.volume)})
//file:///C:/Archivos_script_temporales/Curso_D3/Tarea5_redesG/index.html
//https://github.com/jairoruizsaenz/Relaciones-Peliculas/blob/master/resources/js/Force_Directed_Graph_SVG.js
//https://beta.observablehq.com/@mbostock/d3-force-directed-graph
                          function ticked(){
                               selLinks
                                .attr('x1', function (link) { return link.source.x })
                                .attr('y1', function (link) { return link.source.y })
                                .attr('x2', function (link) { return link.target.x })
                                .attr('y2', function (link) { return link.target.y });


                               selNodes
                                   .attr('cx', function (node) { return node.x })
                                   .attr('cy', function (node) { return node.y });

                             }

                             function dragstarted(d)
                             {
                             //  if (!d3.event.active) simulation.alphaTarget(0.4).restart();
                               d.fx = d.x;
                               d.fy = d.y;
                             }

                             function dragged(d)
                             {
                               d.fx = d3.event.x;
                               d.fy = d3.event.y;
                             }

                             function dragended(d)
                             {
                               //if (!d3.event.active) simulation.alphaTarget(0).restart();
                               d.fx = null;
                               d.fy = null;
                             }
                  })


}

load_network("https://raw.githubusercontent.com/stanleymf4/Tarea5/master/data/prog_depo.json");
