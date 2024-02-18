import fetch from "node-fetch";
import cookieJwtAuth from "../middleware/cookieJwtAuth.js";
import historyRecorder from "../middleware/historyRecorder.js";

const setWeatherRoute = (app) =>
  app.get("/city/:city", cookieJwtAuth, historyRecorder, async (req, res) => {
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

export default setWeatherRoute;
