import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
  continent: String,
  location: String,
});
const Covid = mongoose.model("covid", userSchema);

server.post("/search", async (req, res) => {
  console.log(req.body);
  const doc = await Covid.find({
    continent: req.body.continent,
    location: req.body.location,
  });
  res.send(doc);
});
server.get("/data", async (req, res) => {
  try {
    const allData = await Covid.find();
    res.send(allData);
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
