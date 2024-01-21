const dayTempEveryhour = [
  { time: "02:00", temp: 18 },
  { time: "05:00", temp: 20 },
  { time: "08:00", temp: 25 },
  { time: "11:00", temp: 27 },
  { time: "14:00", temp: 30 },
  { time: "17:00", temp: 25 },
  { time: "20:00", temp: 20 },
  { time: "23:00", temp: 18 },
];

const svgWidth = 600;
const svgHeight = 150;
const margin = { top: 50, right: 0, bottom: 30, left: 0 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const svg = d3
  .select("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3
  .scaleBand()
  .domain(dayTempEveryhour.map((d) => d.time))
  .range([0, width])
  .padding(0.1);

const yScale = d3
  .scaleLinear()
  .domain([
    d3.min(dayTempEveryhour, (d) => d.temp) - 5,
    d3.max(dayTempEveryhour, (d) => d.temp),
  ])
  .range([height, 0]);

const area = d3
  .area()
  .x((d) => xScale(d.time) + xScale.bandwidth() / 2)
  .y0(height)
  .y1((d) => yScale(d.temp));

svg
  .append("path")
  .datum(dayTempEveryhour)
  .attr("class", "area")
  .attr("d", area);

const line = d3
  .line()
  .x((d) => xScale(d.time) + xScale.bandwidth() / 2)
  .y((d) => yScale(d.temp));

svg
  .append("path")
  .data([dayTempEveryhour])
  .attr("class", "line")
  .attr("d", line);

svg
  .selectAll("text.time")
  .data(dayTempEveryhour)
  .enter()
  .append("text")
  .attr("class", "time")
  .text((d) => d.time)
  .attr("x", (d) => xScale(d.time) + xScale.bandwidth() / 2)
  .attr("y", height + 20) // Adjust the y-position of the time labels
  .attr("text-anchor", "middle")
  .attr("fill", "#B7B7B7")
  .attr("font-size", 14);

svg
  .selectAll("text.temp")
  .data(dayTempEveryhour)
  .enter()
  .append("text")
  .attr("class", "temp")
  .text((d) => d.temp)
  .attr("x", (d) => xScale(d.time) + xScale.bandwidth() / 2)
  .attr("y", (d) => yScale(d.temp) - 8)
  .attr("text-anchor", "middle")
  .attr("fill", "#DEDEDE")
  .attr("font-size", 12)
  .attr("font-weight", "500");

svg.selectAll(".tick line").remove(); // Remove tick lines
svg.selectAll(".domain").remove(); // Remove axis lines

const inputCity = document.getElementById("city-input");
const submitButton = document.getElementById("search-button");

submitButton.addEventListener("click", () => {
  const city = inputCity.value;
  console.log(city);
  fetch("/city", {
    method: "POST",
    body: JSON.stringify({ city }),
  })
    .then((res) => res.json())
    .then(console.log)
    .catch(console.log);
});
