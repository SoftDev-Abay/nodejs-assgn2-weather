import express from "express";
import staticLondonWeatherData from "./assets/data.json" assert { type: "json" };
import fetch from "node-fetch";

const app = express();

app.use(express.json());
app.use(express.static("client"));

// static weather data only gives data for one city, for testing purposes

app.get("/city/:city", async (req, res) => {
  try {
    const city = req.params.city;
    console.log(city);
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=6656578e0521cbcce7f6a487ac954522`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
