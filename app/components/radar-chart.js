import Component from '@ember/component';
import { get } from '@ember/object';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import { format } from 'd3-format';

export default Component.extend({
  didRender(){
    this._super(...arguments);
    let data = get(this, 'data');
    if(data)
      this.radarChart(data);
  },
  radarChart(data){
    if(!data.length)
      return;
    document
      .querySelector('.radar-chart').innerHTML = '';
    let graph = {
        radius: 5,
        w: 250,
        h: 250,
        factor: 1,
        factorLegend: 0.85,
        levels: 7,
        maxValue: 0,
        radians: 2 * Math.PI,
        opacityArea: 0.5,
        toRight: 5,
        translateX: 80,
        translateY: 30,
        extraWidthX: 180,
        extraWidthY: 100
    };

    graph.maxValue = Math.max(graph.maxValue, 
      max(data, (i) => {
        return max(i.map((o) => {
          return o.value;
        }));
    }));

    let allAxis = (data[0].map((i) => {return i.axis})),
        total = allAxis.length,
        radius = graph.factor * Math.min(graph.w/2, graph.h/2),
        Format = format('.0%');
    
    let g = select('#radar-chart')
              .attr("width", graph.w + graph.extraWidthX)
              .attr("height", graph.h + graph.extraWidthY)
              .append("g")
              .attr('id', 'main-graph')
              .attr("transform", 
                `translate(${graph.translateX}, 
                  ${graph.translateY})`);
    
    for(let j = 0; j < graph.levels - 1; j++){

      let levelFactor = graph.factor * 
        radius* ((j+1)/ graph.levels);

      g.selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", (d, i) => {
         return levelFactor * 
           (1-graph.factor * Math.sin(i * graph.radians / total))})
       .attr("y1", (d, i) => {
         return levelFactor * (1-graph.factor * 
           Math.cos(i*graph.radians/total))})
       .attr("x2", (d, i) => {
         return levelFactor * (1 - graph.factor * 
           Math.sin((i+1) * graph.radians / total))})
       .attr("y2", (d, i) => { return levelFactor 
           * (1 - graph.factor 
           * Math.cos((i+1) * graph.radians / total))})
       .attr("class", "line")
       .style("stroke", "#222")
       .style("stroke-opacity", "0.75")
       .style("stroke-width", "0.3px")
       .attr('transform', 
         `translate(${(graph.w / 2 - levelFactor)}, 
           ${(graph.h / 2 - levelFactor)})`);
    }

    for(let j = 0; j < graph.levels; j++){

      let levelFactor = graph.factor * radius * 
        ((j+1) / graph.levels);

      g.selectAll(".levels")
       .data([1]) 
       .enter()
       .append("svg:text")
       .attr("x", () => {
         return levelFactor * (1 - graph.factor * Math.sin(0))})
       .attr("y", () => { return levelFactor * 
           (1 - graph.factor * Math.cos(0))})
       .attr("class", "legend")
       .style("font-family", "sans-serif")
       .style("font-size", "10px")
       .attr("transform", 
         `translate(${(graph.w / 2 - levelFactor + 
           graph.toRight)}, ${(graph.h / 2 - levelFactor)})`)
       .attr("fill", "#222")
       .text(Format( (j+1) * graph.maxValue / graph.levels));
    }

    let series = 0;

    let axis = g.selectAll(".axis")
                .data(allAxis)
                .enter()
                .append("g")
                .attr("class", "axis");
    
    axis.append("line")
        .attr("x1", graph.w / 2)
        .attr("y1", graph.h / 2)
        .attr("x2", (d, i) => {
          return graph.w / 2 * (1 - graph.factor * 
            Math.sin(i * graph.radians / total))})
        .attr("y2", (d, i) => { 
          return graph.h / 2 * ( 1 - graph.factor * 
            Math.cos(i * graph.radians / total))})
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "1px");

    axis.append("text")
      .attr("class", "legend")
      .text((d) => { return d })
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", () => { return "translate(0, -10)"})
      .attr("x", (d, i) => { 
        return graph.w / 2* ( 1 - graph.factorLegend * 
          Math.sin( i * graph.radians / total )) - 60 * 
          Math.sin( i * graph.radians / total)})
      .attr("y", (d, i) => { 
        return graph.h / 2 * ( 1 - Math.cos( i * 
          graph.radians / total)) - 20 * Math.cos( i * 
            graph.radians / total )});

    let dataValues = [];

    data.forEach((y) => {
      g.selectAll(".nodes")
        .data(y, (j, i) => {
          dataValues.push([
            graph.w / 2 * 
              (1 - 
                (parseFloat(Math.max(j.value, 0)) / graph.maxValue)
              * graph.factor * Math.sin(i * graph.radians / total)), 
                graph.h / 2 * (1 - 
                  (parseFloat(Math.max(j.value, 0)) / graph.maxValue)
                  * graph.factor 
                  * Math.cos( i * graph.radians / total))
        ]);
      });

      dataValues.push(dataValues[0]);

      g.selectAll(".area")
       .data([dataValues])
       .enter()
       .append("polygon")
       .attr("class", "radar-chart-serie" + series)
       .style("stroke-width", "2px")
       .style("stroke", '#222')
       .attr("points", (d) => {
         let str = "";
         for(let pti = 0; pti < d.length; pti++){
           str = str + d[pti][0] + "," + d[pti][1] + " ";
         }
         return str;
       })
       .style("fill", '#f2f2f2')
       .style("fill-opacity", graph.opacityArea);
       series++;
    });

    data.forEach((y) => {
      g.selectAll(".nodes")
        .data(y).enter()
        .append("svg:circle")
        .attr("class", "radar-chart-serie" + series)
        .attr('r', graph.radius)
        .attr("alt", (j) => { return Math.max(j.value, 0) })
        .attr("cx", (j, i) => {
          dataValues.push([
            graph.w / 2 * (1 - 
              (parseFloat(Math.max(j.value, 0)) / 
                graph.maxValue) * graph.factor * Math.sin(i 
                  * graph.radians/total)), 
            graph.h/2*(1 - 
              (parseFloat(Math.max(j.value, 0)) / 
                graph.maxValue) 
              * graph.factor 
              * Math.cos( i 
              * graph.radians / total))
         ]);

      return graph.w / 2 * ( 1 - 
        (Math.max(j.value, 0) / graph.maxValue) * 
          graph.factor * Math.sin( i * graph.radians / total));
      })
      .attr("cy", (j, i) => {
        return graph.h / 2 * (1 - 
          (Math.max(j.value, 0) / graph.maxValue) * graph.factor 
          * Math.cos(i * graph.radians / total));
      })
      .attr("data-id", (j) => { return j.axis })
      .style("fill", '#222')
      .style("fill-opacity", .9)
      .append("svg:title")
      .text((j) => {return Math.max(j.value, 0)});
      series++;
    });
  }
});
