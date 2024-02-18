import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const setLoginRoute = (app, collection) =>
  app.post("/login", async (req, res) => {
    try {
      const user = await collection.findOne({ username: req.body.username });
      console.log(user);
      if (user) {
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
          const token = jwt.sign(
            { username: user.username },
            process.env.MY_SECRET_KEY
          );
          res.cookie("token", token, { httpOnly: true });
          res.redirect("/admin-panel");
        } else {
          res.status(400).send("Invalid credentials");
        }
      } else {
        res.status(400).send("Invalid credentials");
      }
    } catch (error) {
      console.log("error logging in", error);
      res.status(500).send("Internal server error");
    }
  });

export default setLoginRoute;
