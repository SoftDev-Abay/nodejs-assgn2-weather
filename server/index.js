import express from "express";
import staticLondonWeatherData from "./assets/data.json" assert { type: "json" };

const app = express();

app.use(express.json());
app.use(express.static("client"));

// static weather data only gives data for one city, for testing purposes

app.post("/city", (req, res) => {
  try {
    const { city } = req.body;
    console.log(city);
    res.json(staticLondonWeatherData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
