import Component from '@ember/component';
import streamChartData from './stream-chart-data';
import { timeFormat } from 'd3-time-format';
import { select, mouse } from 'd3-selection';
import { scaleTime, scaleLinear, scaleOrdinal } from 'd3-scale';
import { axisBottom, axisLeft, axisRight} from 'd3-axis';
//import { timeWeeks } from 'd3-time';
import { stack, area, stackOffsetSilhouette } from 'd3-shape';
import { nest } from 'd3-collection';
import { extent, max } from 'd3-array';

export default Component.extend({
  didInsertElement(){
    this._super(...arguments);
    this.streamChart(streamChartData);
  },
  streamChart(data){
    let colorrange = ["#B30000", "#E34A33", "#FC8D59", 
      "#FDBB84", "#FDD49E", "#FEF0D9"],
        strokecolor = colorrange[0];

    let format = timeFormat("%m/%d/%y");

    let margin = {top: 20, right: 40, bottom: 30, left: 30};
    let width = document.body.clientWidth - 
      margin.left - margin.right;

    let height = 400 - margin.top - margin.bottom;

    let tooltip = select("body")
                    .append("div")
                    .attr("class", "remove")
                    .style("position", "absolute")
                    .style("z-index", "20")
                    .style("visibility", "hidden")
                    .style("top", "30px")
                    .style("left", "55px");

    let x = scaleTime()
              .range([0, width]);

    let y = scaleLinear()
              .range([height - 10, 0]);

    let z = scaleOrdinal()
              .range(colorrange);

    let xAxis = axisBottom(x);

    let gStack = stack()
        .offset(stackOffsetSilhouette)
        .value(function(d) { return d.values; });

    let gNest = nest()
        .key(function(d) { return d.key; });

    let gArea = area()
        .x(function(d) { return x(d.date); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });

    let svg = select(".stream-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
      d.date = format(d.date);
      d.value = +d.value;
    });


    let layers = gStack(gNest.entries(data));

    x.domain(extent(data, 
      function(d) { return d.date; }));
    y.domain([0, max(data, 
      function(d) { return d.y0 + d.y; })]);

    svg.selectAll(".layer")
        .data(layers)
        .enter().append("path")
        .attr("class", "layer")
        .attr("d", function(d) { return gArea(d.values); })
        .style("fill", function(d, i) { return z(i); });


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ", 0)")
        .call(axisRight(y));

    svg.append("g")
        .attr("class", "y axis")
        .call(axisLeft(y));
    let pro;
    svg.selectAll(".layer")
      .attr("opacity", 1)
      .on("mouseover", function(d, i) {
        svg.selectAll(".layer").transition()
        .duration(250)
        .attr("opacity", function(d, j) {
          return j != i ? 0.6 : 1;
      })})
      .on("mousemove", function(d) {
        let mousex = mouse(this);
        mousex = mousex[0];
        let invertedx = x.invert(mousex);
        invertedx = invertedx.getMonth() + invertedx.getDate();
        let selected = (d.values);
        let datearray = [];
        for (var k = 0; k < selected.length; k++) {
          datearray[k] = selected[k].date
          datearray[k] = datearray[k].getMonth() + 
            datearray[k].getDate();
        }

        let mousedate = datearray.indexOf(invertedx);
        
        pro = d.values[mousedate].value;

        select(this)
          .classed("hover", true)
          .attr("stroke", strokecolor)
          .attr("stroke-width", "0.5px"), 
          tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" )
            .style("visibility", "visible");
      })
      .on("mouseout", function(d) {
        svg.selectAll(".layer")
            .transition()
            .duration(250)
            .attr("opacity", "1");

        select(this)
            .classed("hover", false)
            .attr("stroke-width", "0px"), 
              tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" )
                .style("visibility", "hidden");
      })
      
    let vertical = select(".stream-chart")
                    .append("div")
                    .attr("class", "remove")
                    .style("position", "absolute")
                    .style("z-index", "19")
                    .style("width", "1px")
                    .style("height", "380px")
                    .style("top", "10px")
                    .style("bottom", "30px")
                    .style("left", "0px")
                    .style("background", "#fff");
    select(".stream-chart")
        .on("mousemove", function(){  
           let mousex = mouse(this);
           mousex = mousex[0] + 5;
           vertical.style("left", mousex + "px" );
        })
        .on("mouseover", function(){  
           let mousex = mouse(this);
           mousex = mousex[0] + 5;
           vertical.style("left", mousex + "px");
        });
  }
});
