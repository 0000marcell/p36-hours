import Component from '@ember/component';
import { get } from '@ember/object';
import { select } from 'd3-selection';
import { timeParse } from 'd3-time-format';
import { scaleTime, scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';

export default Component.extend({
  classNames: ['line-chart-container'],
  didRender(){
    this._super(...arguments);
    let data = get(this, 'data');
    if(data)
      this.lineChart(data);
  },
  lineChart(data){
    let svg = select(".line-chart");
    svg.attr('width', 645).attr('height', 300);
    let margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 645 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + 
          margin.left + "," + margin.top + ")");

    let parseTime = timeParse("%d-%b-%y");

    let x = scaleTime()
              .rangeRound([0, width]);

    let y = scaleLinear()
              .rangeRound([height, 0]);

    let gline = line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.value); });

    data = data.map((d) => {
      d.date = parseTime(d.date);
      d.value = +d.value;
      return d;
    });

    x.domain(extent(data, function(d) { return d.date; }));
    y.domain(extent(data, function(d) { return d.value; }));

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(axisBottom(x))
      .select(".domain")
        .remove();

    g.append("g")
        .call(axisLeft(y))
      .append("text")
        .attr("fill", "#222")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Hours")

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#222")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", gline);
  }
});
