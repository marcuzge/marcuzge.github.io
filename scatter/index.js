import { dropdownMenu } from './dropdownMenu.js';
import { scatterPlot } from './scatterPlot.js';

const svg = d3.select('#svg3');

const width = +svg.attr('width');
const height = +svg.attr('height');

let data;
let xColumn;
let yColumn;

const onXColumnClicked = column => {
  xColumn = column;
  render();
};

const onYColumnClicked = column => {
  yColumn = column;
  render();
};

const render = () => {
  
  d3.select('#x-menu')
    .call(dropdownMenu, {
      options: data.columns,
      onOptionClicked: onXColumnClicked,
      selectedOption: xColumn
    });
  
  d3.select('#y-menu')
    .call(dropdownMenu, {
      options: data.columns,
      onOptionClicked: onYColumnClicked,
      selectedOption: yColumn
    });
  
  svg.call(scatterPlot, {
    xValue: d => d[xColumn],
    xAxisLabel: xColumn.replaceAll("_", " "),
    yValue: d => d[yColumn],
    circleRadius: 10,
    yAxisLabel: yColumn.replaceAll("_", " "),
    margin: { top: 10, right: 40, bottom: 88, left: 150 },
    width,
    height,
    data
  });
};

d3.csv('hdi.csv')
  .then(loadedData => {
    console.log(loadedData);
    data = loadedData;
    data.forEach(d => {
      d.HDI_Rank = +d.HDI_Rank;
      d.Country = d.Country;
      d.Human_Development_Index = +d.Human_Development_Index;
      d.Life_Expectancy_At_Birth = +d.Life_Expectancy_At_Birth;
      d.Expected_Years_Of_Schooling = +d.Expected_Years_Of_Schooling;
      d.Mean_Years_Of_Schooling = +d.Mean_Years_Of_Schooling;
      d.GNI_Per_Capita = +(d.GNI_Per_Capita.replaceAll(",", ""));
      d.GNI_Per_Capita_Rank_Minus_HDI_Rank = +d.GNI_Per_Capita_Rank_Minus_HDI_Rank;
    });

    console.log(data.GNI_Per_Capita);
    xColumn = data.columns[4];
    yColumn = data.columns[2];
    render();
  });