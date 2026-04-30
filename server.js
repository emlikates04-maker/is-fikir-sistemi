import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

console.log("BOOT OK");

app.get("/", (req, res) => {
  res.send("SERVER OK");
});

app.listen(PORT, () => {
  console.log("RUNNING", PORT);
});