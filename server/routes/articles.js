import fetch from "node-fetch";
import cookieJwtAuth from "../middleware/cookieJwtAuth.js";
import historyRecorder from "../middleware/historyRecorder.js";

const setArticleRoutes = (app) => {
  app.get("/articles", cookieJwtAuth, historyRecorder, async (req, res) => {
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      res.render("articles", {
        title: "Articles",
        articles: data.articles,
        layout: "./layouts/main",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  });
};

export default setArticleRoutes;
