import { colorLegend } from './colorLegend.js';
import {
  loadAndProcessData,
} from './loadAndProcessData.js';
import { lineChart } from './lineChart.js';

const svg = d3.select('#svg2');
const lineChartG = svg.append('g');
const colorLegendG = svg.append('g');

const width = +svg.attr('width');
const height = +svg.attr('height');
const mapping = {
  "europe": "EUROPE AND CENTRAL ASIA", 
  "latin": "LATIN AMERICA & CARRIBIAN",
  "asia": "EAST ASIA & PACIFIC",
  "arab": "ARAB STATES",
  "sasia": "SOUTH ASIA",
  "africa": "SUB-SAHARAN AFRICA"}

// State
let data;

const annotations = [
  {
    note: {
      label: "At this intersection, EAST ASIA's HDI index surpassed ARAB STATES' in 2006.",
      title: ""
    },
    type: d3.annotationCalloutCircle,
    subject: {
      radius: 20,         // circle radius
      radiusPadding: 20   // white space around circle befor connector
    },
    color: ["red"],
    x: 420,
    y: 190,
    dy: 80,
    dx: 80
  }
]

// Add annotation to the chart
const makeAnnotations = d3.annotation()
  .annotations(annotations)
svg
  .append("g")
  .call(makeAnnotations)

const render = () => {
  const yValue = d => d.hdi;
  const colorValue = d => d.name;
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
  const lastYValue = d =>
    yValue(d.values[d.values.length - 1]);
  
  const nested = d3.nest()
    .key(colorValue)
    .entries(data)
    .sort((a, b) =>
      d3.descending(lastYValue(a), lastYValue(b))
    );

  console.log(nested);
  
  colorScale.domain(nested.map(d => d.key));
  
  lineChartG.call(lineChart, {
    colorScale,
    yValue,
    xValue: d => d.year,
    xAxisLabel: 'Time',
    yAxisLabel: 'Human Development Index',
    margin: {
      top: 60,
      right: 280,
      bottom: 88,
      left: 105
    },
    width,
    height,
    data,
    nested
  });
  
  colorLegendG
    .attr('transform', `translate(700,70)`)
    .call(colorLegend, {
      colorScale,
      circleRadius: 10,
      spacing: 25,
      textOffset: 15
    });
};

loadAndProcessData()
  .then((loadedData) => {
    data = loadedData;
    render();
  });


  d3.selectAll('.slide .panel input')
  .on('change', function() {
    loadAndProcessData()
      .then((loadedData) => {
        data = loadedData;
        for (var key in mapping) {
          var typeFilterChecked = d3.select('.slide .panel input.' + key).property('checked');
          if (!typeFilterChecked) {
            data = data.filter(d => d['name'] !== mapping[key]);
          }  
        }
        svg.selectAll(".line-path").remove();
        render();
      });
  });