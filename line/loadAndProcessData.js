export const parseYear = d3.timeParse('%Y');

const allCaps = str => str === str.toUpperCase();
const isRegion = name => allCaps(name) && name !== 'WORLD' && name.length > 0;

export const loadAndProcessData = () => 
  Promise
    .all([d3.csv('trend.csv') ])
    .then(([rawData]) => {
      // console.log(data);
      const years = [1990, 2000, 2010, 2014, 2015, 2017, 2018, 2019];

  const data = [];

  rawData.forEach(d => {
    const name = d['Country']
      .replace('AND THE', '&');
    years.forEach(year => {
      const hdi = +d[year];
      const row = {
        year: parseYear(year),
        name,
        hdi
      };
      data.push(row);
    });
  });

  return data.filter(d => isRegion(d.name));
    });