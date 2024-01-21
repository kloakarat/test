const express = require("express");
const app = express();

const { genPdf } = require("./pdfService");

const port = 1000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/pdf", (req, res) => {
  const body = req.body;
  genPdf(res, body);
});

app.listen(port, () => {
  console.log(`Start server at port ${port}`);
});
