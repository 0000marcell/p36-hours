import Component from '@ember/component';
import { get } from '@ember/object';
import { select } from 'd3-selection';
import { timeFormat } from 'd3-time-format';
import { timeDays, timeMonths, timeYears } from 'd3-time';
import { scaleQuantize } from 'd3-scale';
import { range } from 'd3-array';

export default Component.extend({
  didRender(){
    this._super(...arguments);
    let data = get(this, 'data');
    if(data)
      this.calendarChart(data);
  },
  calendarChart(data){
    document
      .querySelector('.calendar-chart').innerHTML = '';
    let years = Object.keys(data).map((date) => {
          return +date.split('-')[0]
        }),
        firstYear = Math.min(...years),
        lastYear = Math.max(...years);
          

    let width = 960,
        height = 750,
        cellSize = 25; 

    let no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50)),
        shift_up = cellSize * 3;

    let day = timeFormat("%w"), 
        week = timeFormat("%U"), 
        month = timeFormat("%m"), 
        year = timeFormat("%Y"),
        percent = timeFormat(".1%"),
        format = timeFormat("%Y-%m-%d");

    let color = scaleQuantize()
        .domain([-.05, .05])
        .range(range(11).map(function(d) 
          { return "q" + d + "-11"; }));

    let svg = select("#calendar-chart").selectAll("svg")
        .data(range(firstYear, lastYear+1))
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "RdYlGn")
        .append("g")

    let rect = svg.selectAll(".day")
        .data(function(d) { 
          return timeDays(new Date(d, 0, 1), 
            new Date(d + 1, 0, 1));
        })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) {
          let month_padding = 1.2 * cellSize*7 * 
            ((month(d)-1) % (no_months_in_a_row));
          return day(d) * cellSize + month_padding; 
        })
        .attr("y", function(d) { 
          let week_diff = week(d) - week(new Date(year(d), 
            month(d)-1, 1) );
          let row_level = Math.ceil(month(d) / 
            (no_months_in_a_row));
          return (week_diff*cellSize) + 
            row_level*cellSize*8 - cellSize/2 - shift_up;
        })
        .datum(format);

    svg.selectAll(".month-title")
      .data(function(d) { 
        return timeMonths(new Date(d, 0, 1), 
          new Date(d + 1, 0, 1)); })
      .enter().append("text")
      .text(monthTitle)
      .attr("x", function(d) {
        let month_padding = 1.2 * cellSize*7* 
          ((month(d)-1) % (no_months_in_a_row));
        return month_padding;
      })
      .attr("y", function(d) {
        let week_diff = week(d) - week(new Date(year(d), 
          month(d)-1, 1) );
        let row_level = Math.ceil(month(d) / 
          (no_months_in_a_row));
        return (week_diff*cellSize) + 
            row_level*cellSize*8 - cellSize - shift_up;
      })
      .attr("class", "month-title")
      .attr("d", monthTitle);

    svg.selectAll(".year-title")  
       .data(function(d) { 
          return timeYears(new Date(d, 0, 1), 
                    new Date(d + 1, 0, 1)); })
    .enter().append("text")
    .text(yearTitle)
    .attr("x", function() { return width/2 - 100; })
    .attr("y", function() { return cellSize*5.5 - 
        shift_up; })
    .attr("class", "year-title")
    .attr("d", yearTitle);

    /*
    let tooltip = select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .text("a simple tooltip");
                    */


    rect.filter(function(d) { return d in data; })
            .attr("class", function(d) { 
              return "day " + color(data[d]); })
            .select("title")
            .text(function(d) { return d + ": " + 
                percent(data[d]); });
    /*
    rect.on("mouseover", mouseover);
    rect.on("mouseout", mouseout);
    */
    
    /*
    function mouseover(d) {
      tooltip.style("visibility", "visible");
      let percent_data = (data[d] !== undefined) ? 
        percent(data[d]) : percent(0);
      let purchase_text = d + ": " + percent_data;

      tooltip.transition()        
                  .duration(200)      
                  .style("opacity", .9);      
      tooltip.html(purchase_text)  
                  .style("left", 
                    (event.pageX)+30 + "px")     
                  .style("top", 
                    (event.pageY) + "px"); 
    }

    function mouseout () {
      tooltip.transition()        
              .duration(500)      
              .style("opacity", 0); 
      let $tooltip = document.querySelector("#tooltip");
      $tooltip.innerHTML = '';
    }
    */

    function monthTitle (t0) {
      return t0.toLocaleString("en-us", { month: "long" });
    }
    function yearTitle (t0) {
      return t0.toString().split(" ")[3];
    }
  }
});
