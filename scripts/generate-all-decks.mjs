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

// Stage in temp to convert cleanly if soffice/libreoffice is available
let hasSoffice = false;
try {
  execFileSync("which", ["soffice"], { stdio: "ignore" });
  hasSoffice = true;
} catch {
  try {
    execFileSync("which", ["libreoffice"], { stdio: "ignore" });
    hasSoffice = true;
  } catch {
    hasSoffice = false;
  }
}

if (hasSoffice) {
  console.log("=== Converting to standard PPTX, PPT, and PDF via LibreOffice headless ===");
  const stagedPptx = resolve("/tmp/deck/staged.pptx");
  fs.copyFileSync(targetPptx, stagedPptx);

  for (const fmt of ["pptx", "ppt", "pdf"]) {
    console.log(`Converting to ${fmt}...`);
    try {
      execFileSync("soffice", ["--headless", "--convert-to", fmt, "--outdir", publicDir, stagedPptx], {
        stdio: "inherit",
      });
    } catch (e) {
      console.warn(`Could not convert to ${fmt}:`, e.message);
    }
  }

  // Rename staged.* in public/ to TM-Pick-n-Pay-Express.*
  for (const ext of ["pptx", "ppt", "pdf"]) {
    const generated = resolve(publicDir, `staged.${ext}`);
    const target = resolve(publicDir, `TM-Pick-n-Pay-Express.${ext}`);
    if (fs.existsSync(generated)) {
      fs.renameSync(generated, target);
    }
  }
} else {
  console.log("soffice not found in environment, keeping generated standalone PPTX and existing deliverables.");
}

// Verify output files exist and log their sizes
console.log("=== STEP 4: Verifying generated deck assets ===");
for (const ext of ["pptx", "ppt", "pdf"]) {
  const file = resolve(publicDir, `TM-Pick-n-Pay-Express.${ext}`);
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`✓ ${file}: ${(stats.size / 1024).toFixed(1)} KB`);
  } else {
    console.error(`✗ Missing file: ${file}`);
    process.exit(1);
  }
}

console.log("=== SUCCESS: All slides built and saved in public/ ===");
