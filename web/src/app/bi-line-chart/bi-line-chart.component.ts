// Imports
import { Component, OnInit, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bi-line-chart',
  templateUrl: './bi-line-chart.component.html'
})
export class BiLineChartComponent {

  @Input()
  private dataset1: any[];
  @Input()
  private dataset2: any[];

  private svg: d3.Selection<d3.BaseType, {}, null, undefined>;
  private chart: d3.Selection<d3.BaseType, {}, null, undefined>;

  private margin = { top: 20, right: 20, bottom: 25, left: 45 };
  private width = 960;
  private height = 500;

  private colors: string[] = ['#5F88A1', '#AFC3D0'];

  constructor(private elementRef: ElementRef) {

  }

  ngAfterViewInit() {
    this.initialize();
  }

  ngOnChanges(changes: any) {

    if (changes.dataset1 != undefined) {
      this.dataset1 = changes.dataset1.currentValue;
    }

    if (changes.dataset2 != undefined) {
      this.dataset2 = changes.dataset2.currentValue;
    }
    
    this.draw();
  }

  private initialize() {
    
    this.width = this.elementRef.nativeElement.querySelector('div').clientWidth;

    // Initializes svg element
    this.svg = d3.select(this.elementRef.nativeElement).select('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    // Initializes chart element
    this.chart = this.svg.append("g")
      .attr("transform",
      "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.draw();
  }

  private draw() {

    // Check if data sets or svg is null
    if (this.dataset1 == null || this.dataset2 == null || this.svg == null) {
      return;
    }

    // Adds datasets to one variable
    let datasets = [this.dataset1, this.dataset2];

    // Sets x and y scale
    let x = d3.scaleBand().range([0, this.width]);
    let y = d3.scaleLinear().range([this.height, 0]);

    x.domain(this.dataset1.map(x => x.key));
    y.domain(d3.extent(this.dataset1.concat(this.dataset2), (d: any) => { return d.value }));

    // Sets line
    let valueline: any = d3.line()
      .x((d: any) => { return x(d.key); })
      .y((d: any) => { return y(d.value); });

    // Removes existing lines
    this.chart.selectAll('path.line').remove();

    // Draws lines
    this.chart
      .selectAll('path.line')
      .data(datasets)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("d", valueline)
      .attr('fill', 'none')
      .attr('stroke', (d: any, i: number) => this.colors[i])
      .attr('opacity', 0)
      .transition()
      .duration(1500)
      .attr('opacity', 1)


    // Removes existing data points
    this.chart.selectAll('circle.point').remove();

    // Draws data point and attaches hover events
    for (let n = 0; n < datasets.length; n++) {
      this.chart.selectAll('circle.point.dataset' + n)
        .data(datasets[n])
        .enter()
        .append("circle")
        .attr('class', 'point dataset' + n)
        .attr('cx', (d: any, i: number) => x(d.key))
        .attr('cy', (d: any, i: number) => y(d.value))
        .attr('r', 3)
        .attr('fill', (d: any) => this.colors[n])
        .on('mouseover', () => {
          d3.select(d3.event.target).transition().attr('r', 5);
        })
        .on('mouseout', () => {
          d3.select(d3.event.target).transition().attr('r', 3);
        })
        .attr('opacity', 0)
        .transition()
        .duration(1500)
        .attr('opacity', 1)
    }

    // Removes existing x and y axis
    this.svg.selectAll('g.axis').remove();


    let xForAxis = d3.scaleOrdinal().range(this.dataset1.map((d, i) => i * x.bandwidth())).domain(this.dataset1.map((d, i) => d.key));

    // Draws x axis
    this.svg.append("g")
      .attr('class', 'axis')
      .attr("transform", "translate(" + this.margin.left + "," + (this.height + this.margin.top) + ")")
      .call(d3.axisBottom(<any>xForAxis));

    // Draws y axis
    this.svg.append("g")
      .attr('class', 'axis')
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
      .call(d3.axisLeft(y).ticks(5).tickFormat((d: number) => d.toString()));
  }


}
