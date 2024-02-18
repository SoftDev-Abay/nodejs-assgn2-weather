import fetch from "node-fetch";
import cookieJwtAuth from "../middleware/cookieJwtAuth.js";
import historyRecorder from "../middleware/historyRecorder.js";
const setApodRoute = (app) =>
  app.get("/apod", cookieJwtAuth, historyRecorder, async (req, res) => {
    try {
      const url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`;

      let response = await fetch(url);
      let data = await response.json();

      res.render("apod", {
        title: "Astronomy Picture of the Day",
        picTitile: data.title,
        date: data.date,
        explanation: data.explanation,
        url: data.url,
        layout: "./layouts/main",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  });

export default setApodRoute;
