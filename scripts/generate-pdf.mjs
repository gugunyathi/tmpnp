import fs from "node:fs";
import path from "node:path";

async function generatePDF() {
  console.log("=== Generating 27-Slide High-Definition PDF ===");
  
  let puppeteer;
  try {
    puppeteer = (await import("puppeteer")).default;
  } catch {
    console.warn("puppeteer not installed, checking for puppeteer-core...");
    puppeteer = (await import("puppeteer-core")).default;
  }

  const chromePaths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ];
  const executablePath = chromePaths.find((p) => fs.existsSync(p));

  const launchOptions = {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  };
  if (executablePath) {
    launchOptions.executablePath = executablePath;
    console.log(`Using browser: ${executablePath}`);
  }

  const browser = await puppeteer.launch(launchOptions);

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 60000 });
  await page.emulateMediaType("print");

  const publicDir = path.resolve("public");
  fs.mkdirSync(publicDir, { recursive: true });

  const pdfPath = path.resolve(publicDir, "TM-Pick-n-Pay-Express.pdf");
  await page.pdf({
    path: pdfPath,
    width: "1920px",
    height: "1080px",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();

  const stats = fs.statSync(pdfPath);
  console.log(`✓ PDF successfully generated: ${(stats.size / 1024).toFixed(1)} KB`);
}

generatePDF().catch((err) => {
  console.error("PDF generation error:", err.message);
  process.exit(1);
});
