import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Skill Bridge Server is running");
});

app.listen(port, () => {
  console.log(`Skill Bridge Server is running on port ${port}`);
});
