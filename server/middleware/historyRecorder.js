// historyRecorder.js

import { apiHistory, collection } from "../config.js";

const historyRecorder = async (req, res, next) => {
  // Find the user by username
  const user = await collection.findOne({
    username: req.token_user.username,
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Create a new API history document
  const history = {
    userId: user._id,
    endpoint: req.url,
    // Add more fields as needed
  };

  // Save the API history document to the database
  const result = await apiHistory.insertMany(history);

  next();
};

export default historyRecorder;
