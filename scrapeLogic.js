const puppeteer = require("puppeteer");
require("dotenv").config();
const ejs = require("ejs");

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const html = await ejs.renderFile(
      "./templates/layout.html.ejs",
      { body: 'tableHtml' },
      { async: true }
    );

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'domcontentloaded'
    })

    const pdfBuffer = await page.pdf({
      format: 'A4'
    })
   
    res
        .writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment",
        })
        .end(pdfBuffer);

  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };