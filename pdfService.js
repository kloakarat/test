const puppeteer = require("puppeteer");
const ejs = require("ejs");

const genPdf = async (res, receipt) => {
  const browser = await puppeteer.launch({
    // headless: 'new',
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
      "--font-render-hinting=none",
      "--force-color-profile=srgb"
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const tableHtml = await ejs.renderFile(
      "./templates/table.html.ejs",
      { items: receipt.items, receipt },
      { async: true }
    );
    const html = await ejs.renderFile(
      "./templates/layout.html.ejs",
      { tableHtml, receipt },
      { async: true }
    );

    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36");

    await page.setContent(html, {waitUntil: "load"});

    const options = {
        format: "A4",
        margin: { top: 80, left: 100, right: 80, bottom: 100 },
      };

      
    const pdfBuffer = await page.pdf(options);

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

module.exports = { genPdf };
