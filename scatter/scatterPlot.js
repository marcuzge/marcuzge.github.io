export const scatterPlot = (selection, props) => {
  const {
    xValue,
    xAxisLabel,
    yValue,
    circleRadius,
    yAxisLabel,
    margin,
    width,
    height,
    data
  } = props;
  
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();
  
  const yScale = d3.scaleLinear();
  yScale.domain(d3.extent(data, yValue));
  yScale.range([innerHeight, 0]);
  yScale.nice();
  
  const g = selection.selectAll('.container').data([null]);
  const gEnter = g
    .enter().append('g')
      .attr('class', 'container');
  gEnter
    .merge(g)
      .attr('transform',
        `translate(${margin.left},${margin.top})`
      );
  
  const xAxis = d3.axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickFormat(xAxisLabel === "GNI Per Capita" ? d3.format('.2s') : d3.format('.2'))
    .tickPadding(15);
  
  const yAxis = d3.axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickFormat(xAxisLabel === "GNI Per Capita" ? d3.format('.2s') :  d3.format('.2'))
    .tickPadding(10);
  
  const yAxisG = g.select('.y-axis');
  const yAxisGEnter = gEnter
    .append('g')
      .attr('class', 'y-axis');
  yAxisG
    .merge(yAxisGEnter)
      .call(yAxis)
      .selectAll('.domain').remove();
  
  const yAxisLabelText = yAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', -93)
      .attr('fill', 'black')
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
    .merge(yAxisG.select('.axis-label'))
      .attr('x', -innerHeight / 2)
      .text(yAxisLabel);
  
  
  const xAxisG = g.select('.x-axis');
  const xAxisGEnter = gEnter
    .append('g')
      .attr('class', 'x-axis');
  xAxisG
    .merge(xAxisGEnter)
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('.domain').remove();
  
  const xAxisLabelText = xAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', 75)
      .attr('fill', 'black')
    .merge(xAxisG.select('.axis-label'))
      .attr('x', innerWidth / 2)
      .text(xAxisLabel);

  
  const circles = g.merge(gEnter)
    .selectAll('circle').data(data);
  circles
    .enter().append('circle')
      .attr('class', "scatter-circle")
      .attr('cx', innerWidth / 2)
      .attr('cy', innerHeight / 2)
      .attr('r', 0)
    .merge(circles)
    .transition().duration(2000)
    .delay((d, i) => i * 10)
      .attr('cy', d => yScale(yValue(d)))
      .attr('cx', d => xScale(xValue(d)))
      .attr('r', circleRadius);
};