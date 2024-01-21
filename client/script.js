const convertKelvinToCelsius = (kelvin) => {
  return kelvin - 273.15;
};

const renderGraph = (data) => {
  // remove previous graph
  d3.select("svg").remove();
  // create new svg
  d3.select("#graph-container").append("svg");

  const dayTempEveryhour = data.map((item) => {
    const time = item.dt_txt.split(" ")[1].split(":")[0];
    const temp = convertKelvinToCelsius(item.main.temp).toFixed(0);

    return { time, temp };
  });

  const svgWidth = 600;
  const svgHeight = 150;
  const margin = { top: 100, right: 0, bottom: 30, left: 0 };
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
      d3.min(dayTempEveryhour, (d) => d.temp) > 0
        ? d3.min(dayTempEveryhour, (d) => d.temp) - 5
        : d3.min(dayTempEveryhour, (d) => d.temp),
      d3.max(dayTempEveryhour, (d) => d.temp),
    ])
    .range([height, d3.min(dayTempEveryhour, (d) => d.temp)]);

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
};

const renderDayData = (data) => {
  // main-weather-description,main-current-time,main-weekday, main-humidity, main-wind, main-feels-like,main-temperature, main-weather-img
  const wetherDescriptionSpan = document.getElementById(
    "main-weather-description"
  );
  const timeSpan = document.getElementById("main-current-time");
  const dayOfWeekSpan = document.getElementById("main-weekday");
  const tempSpan = document.getElementById("main-temperature");
  const humiditySpan = document.getElementById("main-humidity");
  const windSpan = document.getElementById("main-wind");
  const feelsLikeSpan = document.getElementById("main-feels-like");
  const weatherImg = document.getElementById("main-weather-img");

  // get hour data that is closest to current time but not in the future
  const currentHour = new Date().getHours();
  const currentDayData = data.find((item) => {
    const hour = new Date(item.dt_txt).getHours();
    return hour >= currentHour;
  });
  console.log(currentDayData);

  const { weather, main, wind, dt_txt } = currentDayData;
  const { temp, humidity } = main;
  const { speed } = wind;
  const { description, main: mainWeather } = weather[0];
  const iconUrl = getIconUrl(mainWeather.toLowerCase());

  const dayOfWeek = getDayOfWeek(dt_txt);
  const hour = dt_txt.split(" ")[1].split(":")[0];

  wetherDescriptionSpan.innerText = description;

  timeSpan.innerText = `${hour}:00`;
  dayOfWeekSpan.innerText = dayOfWeek;
  tempSpan.innerText = convertKelvinToCelsius(temp).toFixed(0);
  humiditySpan.innerText = humidity;
  windSpan.innerText = speed;
  feelsLikeSpan.innerText = convertKelvinToCelsius(temp).toFixed(0) + "°";
  weatherImg.src = iconUrl;
};

const inputCity = document.getElementById("city-input");
const submitButton = document.getElementById("search-button");

submitButton.addEventListener("click", async () => {
  const city = inputCity.value;

  if (!city || city.length < 2 || city.length > 20 || !isNaN(city)) {
    return;
  }

  try {
    console.log(city);
    const res = await fetch(`/city/${city}`);

    const data = await res.json();

    const errContentDiv = document.getElementById("err-content-container");
    errContentDiv.classList.add("hidden");

    const contentDiv = document.getElementById("main-content");
    contentDiv.classList.remove("hidden");

    const { list } = data;
    const sortedDays = sortByDays(list);

    const firstDay = sortedDays[Object.keys(sortedDays)[0]];

    renderDayData(firstDay);
    renderDays(sortedDays);
    renderGraph(firstDay);
  } catch (error) {
    console.log(error);
    const contentDiv = document.getElementById("main-content");
    contentDiv.classList.add("hidden");
    const errContentTextDiv = document.getElementById("err-content-text");
    errContentTextDiv.innerText = "City not found";
    const errContentDiv = document.getElementById("err-content-container");
    errContentDiv.classList.remove("hidden");
  }
});

const sortByDays = (data) => {
  const days = data.reduce((acc, item) => {
    const day = item.dt_txt.split(" ")[0];

    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(item);
    return acc;
  }, {});
  return days;
};

const getDayOfWeek = (date) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thusrday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = new Date(date).getDay();
  return days[dayOfWeek];
};

const daysContainer = document.getElementById("days-container");

function getIconUrl(weather) {
  return `https://murphyslaw.github.io/hosted-assets/weather/${weather.toLowerCase()}.png`;
}

const getMinMaxDayTemp = (day) => {
  const temps = day.map((item) => item.main.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  return { min, max };
};

const renderDays = (days) => {
  daysContainer.innerHTML = "";
  Object.entries(days).forEach(([day, data]) => {
    const dayContainer = document.createElement("div");
    const iconUrl = getIconUrl(data[0].weather[0].main);
    const { min, max } = getMinMaxDayTemp(data);
    const minCelsius = convertKelvinToCelsius(min).toFixed(0);
    const maxCelsius = convertKelvinToCelsius(max).toFixed(0);
    const dayOfWeek = getDayOfWeek(day).slice(0, 3);
    dayContainer.className =
      " flex-grow flex flex-col rounded-lg px-2 py-1 items-center cursor-pointer hover:bg-gray-100";
    dayContainer.innerHTML = `
            <span>${dayOfWeek}</span>
            <img
              src="${iconUrl}"
              class="mt-1"
              style="width: 50px; height: 50px"
            />

            <div class="text-xs mt-[2px]">
              <span>${maxCelsius}° </span>
              <span class="text-gray-500">${minCelsius}°</span>
            </div>
      `;

    dayContainer.addEventListener("click", () => {
      renderGraph(data);
      renderDayData(data);
    });

    daysContainer.appendChild(dayContainer);
  });
};
