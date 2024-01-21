const express = require("express");
const app = express();

const { scrapeLogic } = require("./scrapeLogic");

const port = 1000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/pdf", (req, res) => {
    scrapeLogic(res);
});

app.listen(port, () => {
  console.log(`Start server at port ${port}`);
});
