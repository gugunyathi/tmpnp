import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { resolve } from "node:path";

console.log("=== STEP 1: Building raw PPTX from deck definitions ===");
execFileSync("node", ["scripts/build-pptx.mjs"], { stdio: "inherit" });

const rawPath = resolve("/tmp/deck/TM-Pick-n-Pay-Express.raw.pptx");
const repackedPath = resolve("/tmp/deck/TM-Pick-n-Pay-Express.repacked.pptx");
const publicDir = resolve("public");

fs.mkdirSync(publicDir, { recursive: true });

console.log("=== STEP 2: Repacking into standard OPC zip package ===");
execFileSync("node", ["scripts/repack-pptx.mjs", rawPath, repackedPath], { stdio: "inherit" });

console.log("=== STEP 3: Preparing standard PPTX package ===");
const targetPptx = resolve(publicDir, "TM-Pick-n-Pay-Express.pptx");
fs.copyFileSync(repackedPath, targetPptx);

console.log("=== STEP 4: Generating high-definition 27-slide PDF ===");
try {
  execFileSync("node", ["scripts/generate-pdf.mjs"], { stdio: "inherit" });
} catch (e) {
  console.warn("Could not generate PDF via Puppeteer:", e.message);
}

// Verify output files exist and log their sizes
console.log("=== STEP 5: Verifying generated deck assets ===");
for (const ext of ["pptx", "pdf"]) {
  const file = resolve(publicDir, `TM-Pick-n-Pay-Express.${ext}`);
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`✓ ${file}: ${(stats.size / 1024).toFixed(1)} KB`);
  } else {
    console.error(`✗ Missing file: ${file}`);
    process.exit(1);
  }
}

console.log("=== SUCCESS: All presentation deliverables built and saved in public/ ===");
