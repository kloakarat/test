const express = require("express");
const app = express();

const puppeteer = require("puppeteer");

const port = 1000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/pdf", (req, res) => {
  puppeteer.launch();
  res.send("Hello World");
});
app.listen(port, () => {
  console.log(`Start server at port ${port}`);
});
