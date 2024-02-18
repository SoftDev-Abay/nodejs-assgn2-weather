import bcrypt from "bcrypt";

const setSignupRoute = (app, collection) =>
  app.post("/signup", async (req, res) => {
    try {
      console.log(req.body);
      const password = req.body.password;
      const confirmPassword = req.body.confirm_password;
      if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { username: req.body.username, password: hashedPassword };

      const existingUser = await collection.findOne({
        username: user.username,
      });

      if (existingUser) {
        return res.status(400).send("User already exists");
      }

      const userdata = await collection.insertMany(user);

      res.status(201).send("User created successfully");
    } catch (error) {
      console.log("error adding user", error);
      res.status(500).send("Internal server error");
    }
  });

export default setSignupRoute;
//
