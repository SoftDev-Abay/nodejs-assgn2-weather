import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import path from "path";
import cookieParser from "cookie-parser";
import { collection } from "./config.js";
import dotenv from "dotenv";
import setLoginRoute from "./routes/login.js";
import setSignupRoute from "./routes/signup.js";
import setApodRoute from "./routes/apod.js";
import setWeatherRoute from "./routes/weather.js";
import setArticleRoutes from "./routes/articles.js";
import setAdminPanelRoutes from "./routes/adminPanel.js";
import setHistoryRoutes from "./routes/history.js";
dotenv.config(); // load environment variables from .env file

const app = express();

app.use(expressEjsLayouts);
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use("/weather", express.static("client"));
app.use(express.static("public"));

app.get("/login", (req, res) => {
  res.render("login", { layout: false });
});

app.get("/signup", (req, res) => {
  res.render("signup", { layout: false });
});

setLoginRoute(app, collection);
setSignupRoute(app, collection);
setAdminPanelRoutes(app, collection);
setApodRoute(app);
setWeatherRoute(app);
setArticleRoutes(app);
setHistoryRoutes(app);

app.get("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send("Logged out successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
