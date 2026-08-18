/**
 * Final stage of the deck pipeline.
 *
 * pptxgenjs output — even after repack-pptx.mjs fixes the OPC package — is
 * still rejected by desktop PowerPoint (14 generated slide masters, an
 * `image/jpg` content-type default, and artistic-effect fill tokens it does
 * not accept). Round-tripping the file through LibreOffice rewrites it with a
 * canonical Microsoft-compatible writer, and also gives us the legacy binary
 * .ppt variant. Requires `soffice` on PATH.
 *
 *   node scripts/finalize-pptx.mjs public/TM-Pick-n-Pay-Express.pptx
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { dirname, resolve } from "node:path";

const input = resolve(process.argv[2] ?? "public/TM-Pick-n-Pay-Express.pptx");
const outdir = dirname(input);

// Stage in temp so soffice can rewrite pptx to target without same-file lock conflict
const staged = resolve("/tmp/deck/staged-for-finalize.pptx");
fs.mkdirSync("/tmp/deck", { recursive: true });
fs.copyFileSync(input, staged);

for (const fmt of ["pptx", "ppt", "pdf"]) {
  execFileSync("soffice", ["--headless", "--convert-to", fmt, "--outdir", outdir, staged], {
    stdio: "inherit",
  });
}

// Rename staged.* in outdir to match input base name
const baseName = input.replace(/\.pptx$/, "");
for (const ext of ["pptx", "ppt", "pdf"]) {
  const generated = resolve(outdir, `staged-for-finalize.${ext}`);
  const target = resolve(outdir, `${baseName.split("/").pop()}.${ext}`);
  if (fs.existsSync(generated)) {
    fs.renameSync(generated, target);
  }
}

console.log("finalized", input);
