import cookieJwtAuth from "../middleware/cookieJwtAuth.js";
import { apiHistory, collection } from "../config.js";

const setHistoryRoutes = (app) => {
  app.get("/history", cookieJwtAuth, async (req, res) => {
    try {
      const user = await collection.findOne({
        username: req.token_user.username,
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const data = await apiHistory.find({ userId: user._id });

      console.log(data);

      res.render("history", {
        title: "History",
        history: data,
        layout: "./layouts/main",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  });
};

export default setHistoryRoutes;
