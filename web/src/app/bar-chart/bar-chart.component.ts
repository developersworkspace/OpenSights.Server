// Imports
import { Component, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {

  @Input()
  data: any[] = null;

  private svg: any;
  private margin = { top: 20, right: 20, bottom: 120, left: 70 };
  private width = 960 - this.margin.left - this.margin.right;
  private height = 500 - this.margin.top - this.margin.bottom;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    this.data = changes.data.currentValue;

    this.draw();
  }


  ngAfterViewInit() {
    this.svg = d3.select(this.elementRef.nativeElement).select('svg')
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
      "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x", 0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Page Views");

    this.draw();

  }

  draw() {
    if (this.data == null || this.svg == null) {
      return;
    }

    let x = d3.scaleBand()
      .range([0, this.width])
      .padding(0.1);

    let y = d3.scaleLinear()
      .range([this.height, 0]);

    x.domain(this.data.map((d) => d.key));
    y.domain([0, d3.max(this.data, (d) => d.value)]);

    this.svg.selectAll('.bar').remove();

    this.svg.selectAll(".bar")
      .data(this.data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.key))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => this.height - y(d.value))
      .attr('fill', (d) => '#41B380');

    this.svg.selectAll('g.axis').remove();

    this.svg.append("g")
      .attr('class', 'axis')
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll(".tick text")
      .call(this.wrap, this.margin.bottom)
      .attr("dx", "3")
      .attr('text-anchor', 'start')
      .attr('transform', 'rotate(90)');


    this.svg.append("g")
      .attr('class', 'axis')
      .call(d3.axisLeft(y))
      .selectAll("text")

  }

  private wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if ((<SVGTSpanElement>tspan.node()).getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

}
