import {
  parseYear
} from './loadAndProcessData.js';

export const lineChart = (selection, props) => {
  const {
    colorScale,
    yValue,
    xValue,
    xAxisLabel,
    yAxisLabel,
    margin,
    width,
    height,
    data,
    nested
  } = props;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth]);
  
  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([innerHeight, 0])
    .nice();
  
    console.log(data);
    console.log(d3.extent(data, yValue));
  
  const g = selection.selectAll('.container').data([null]);
  const gEnter = g.enter()
    .append('g')
      .attr('class', 'container');
  gEnter.merge(g)
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  const xAxis = d3.axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);
  
  const yAxisTickFormat = number =>
    number;

  const yAxis = d3.axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickFormat(yAxisTickFormat)
    .tickPadding(10);
  
  const yAxisGEnter = gEnter
    .append('g')
      .attr('class', 'y-axis');
  const yAxisG = g.select('.y-axis');
  yAxisGEnter
    .merge(yAxisG)
      .call(yAxis)
      .selectAll('.domain').remove();
  
  yAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', -60)
      .attr('fill', 'black')
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
    .merge(yAxisG.select('.axis-label'))
      .attr('x', -innerHeight / 2)
      .text(yAxisLabel);
  
  const xAxisGEnter = gEnter
    .append('g')
      .attr('class', 'x-axis');
  const xAxisG = g.select('.x-axis');
  xAxisGEnter
    .merge(xAxisG)
      .call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`)
      .select('.domain').remove();
  
  xAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', 80)
      .attr('fill', 'black')
    .merge(xAxisG.select('.axis-label'))
      .attr('x', innerWidth / 2)
      .text(xAxisLabel);
  
  const lineGenerator = d3.line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValue(d)))
    .curve(d3.curveBasis);
  
  
  const linePaths = g.merge(gEnter)
    .selectAll('.line-path').data(nested);
  linePaths
    .enter().append('path')
      .attr('class', 'line-path')
    .merge(linePaths)
      .attr('d', d => lineGenerator(d.values))
      .attr('stroke', d => colorScale(d.key));
};