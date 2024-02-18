import bcrypt from "bcrypt";
import cookieJwtAuth from "../middleware/cookieJwtAuth.js";

const setAdminPanelRoutes = (app, collection) => {
  app.get("/admin-panel", cookieJwtAuth, async (req, res) => {
    try {
      const users = await collection.find({});
      res.render("adminPanel", {
        users,
        title: "adminPanel",
        layout: "./layouts/main",
      });
    } catch (error) {
      console.log("error getting users", error);
      res.status(500).send("Internal server error");
    }
  });

  app.delete("/delete-user", cookieJwtAuth, async (req, res) => {
    try {
      const user = await collection.findOne({ username: req.body.username });
      if (user) {
        await collection.deleteOne(user);
        res.status(200).json({ message: "User deleted" });
      } else {
        res.status(400).json({ error: "User not found" });
      }
    } catch (error) {
      console.log("error deleting user", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/update-user", cookieJwtAuth, async (req, res) => {
    try {
      const user = await collection.findOne({ username: req.body.username });

      if (user) {
        await collection.updateOne(
          { username: req.body.username },
          { $set: { password: req.body.password } }
        );
        res.redirect("/admin-panel");
      }
    } catch (error) {
      console.log("error updating user", error);
      res.status(500).send("Internal server error");
    }
  });

  app.post("/add-user", cookieJwtAuth, async (req, res) => {
    try {
      const user = await collection.findOne({ username: req.body.username });
      if (user) {
        return res.status(400).send("User already exists");
      }
      const password = req.body.password;
      const confirmPassword = req.body.confirm_password;
      if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { username: req.body.username, password: hashedPassword };
      const userdata = await collection.insertMany(newUser);
      return res.redirect("/admin-panel");
    } catch (error) {
      console.log("error adding user", error);
      res.status(500).send("Internal server error");
    }
  });
};

export default setAdminPanelRoutes;
