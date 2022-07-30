const svg = d3.select('#svg1');

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);

const g = svg.append('g');

g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}));

svg.call(d3.zoom().on('zoom', () => {
  g.attr('transform', d3.event.transform);
}));

Promise.all([
  d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json'),
  d3.csv('CSV3.csv')
]).then(([topoJSONdata, hdiData]) => {
  
  const countryName = {};
  hdiData.forEach(d => {
    countryName[d.iso_n3] = [d.Country, d.Human_Development_Index, d.Life_Expectancy_At_Birth, d.Expected_Years_Of_Schooling, d.Mean_Years_Of_Schooling, d.GNI_Per_Capita];
    console.log(countryName[d.iso_n3][0])
  });

  
  const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);
  g.selectAll('path').data(countries.features)
    .enter().append('path')
      .attr('class', 'country')
      .attr('d', pathGenerator)
    .append('title')
      .text(d => countryName[d.id] !== undefined ? countryName[d.id][0] + "\nHuman Development Index: " + countryName[d.id][1] + ",\nLife Expectency at Birth: " + countryName[d.id][2] + ",\nExpected Years of Schooling: " + countryName[d.id][3] + ",\nMean Years of Schooling: " + countryName[d.id][4] + ",\nGNI per capita (2017 PPP $): " + countryName[d.id][5] : "No Data Available.");
  
});