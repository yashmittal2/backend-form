import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const server = express();
server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
  continent: String,
  location: String,
});
const Covid = mongoose.model("covid", userSchema);

server.post("/search", async (req, res) => {
  console.log(req.body);
  const start = Date.now(); // Capture the start time

  try {
    const doc = await Covid.find({
      continent: req.body.continent,
      location: req.body.location,
    });

    const end = Date.now(); // Capture the end time
    const duration = end - start; // Calculate the duration

    const data = { duration, result: doc };
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

server.get("/data", async (req, res) => {
  const start = Date.now(); // Capture the start time

  try {
    const allData = await Covid.find();

    const end = Date.now(); // Capture the end time
    const duration = end - start; // Calculate the duration

    const data = { duration, result: allData };
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("db connected");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }

  server.listen(8080, () => {
    console.log("server started");
  });
})();
