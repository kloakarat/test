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
      "--force-color-profile=srgb",
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
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    );

    var document = `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
    body {
      font-family: 'Kanit', sans-serif;
    }
  </style>
  <meta charset="utf-8" />
</head>
<body>
<h1>Hello world!</h1>
<h1>สวัสดี!</h1>
</body>
</html>
`;
    // await page.setContent(html, { waitUntil: "load" });
    await page.goto('data:text/html,' + document, {waitUntil: "networkidle0"});

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
