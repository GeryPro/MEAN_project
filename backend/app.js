const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join("./images")));

mongoose
  .connect(process.env.MONGO_ATLAS_CONNECTION)
  .then(() => console.log("Connected to MongoDB"))
  .catch(() => console.log("Couldn't connect to MongoDB"));

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
