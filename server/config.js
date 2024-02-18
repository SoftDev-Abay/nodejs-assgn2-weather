// config.js

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // load environment variables from .env file

// Connect to MongoDB
mongoose
  .connect(`${process.env.MONGO_URL}login`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Define the schema for the login collection
const loginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Define the schema for the API history collection
const apiHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // Reference to the users collection
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create models
const collection = mongoose.model("users", loginSchema);
const apiHistory = mongoose.model("api_histories", apiHistorySchema);

export { collection, apiHistory };
