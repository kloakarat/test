const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const htmlToPdf = require("html-pdf-node");
const ejs = require("ejs");

const port = 1000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post("/pdf", async function (req, res) {
  const tableHtml = await ejs.renderFile(
    "./templates/table.html.ejs",
    { rows: req.body.rows },
    { async: true }
  );
  const html = await ejs.renderFile(
    "./templates/layout.html.ejs",
    { body: tableHtml },
    { async: true }
  );
  let options = {
    format: "A4",
    margin: { top: 15, left: 10, right: 10, bottom: 15 },
  };
  let file = { content: html };
  htmlToPdf
    .generatePdf(file, options)
    .then((pdfBuffer) => {
      res
        .writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment",
        })
        .end(pdfBuffer);
    })
    .catch((err) => {
      res.send({ success: false, error: err });
    });
});

app.listen(port, () => {
  return console.log(
    `Express server is listening at http://localhost:${port} 🚀`
  );
});
