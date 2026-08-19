import path from "node:path";

// Vercel Serverless Function: /api/download
// Redirects to the corresponding static file in public/.
// The frontend fetch() follows the redirect automatically, gets the blob,
// and triggers a download using link.download = filename (correct name preserved).
export default function handler(req: any, res: any) {
  const rawFile = (req.query?.file as string) || "TM-Pick-n-Pay-Express.pptx";
  const safeFilename = path.basename(rawFile);

  const allowed = [
    "TM-Pick-n-Pay-Express.pptx",
    "TM-Pick-n-Pay-Express.ppt",
    "TM-Pick-n-Pay-Express.pdf",
  ];

  if (!allowed.includes(safeFilename)) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  const ext = path.extname(safeFilename).toLowerCase();
  let contentType = "application/octet-stream";
  if (ext === ".pptx") {
    contentType =
      "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  } else if (ext === ".ppt") {
    contentType = "application/vnd.ms-powerpoint";
  } else if (ext === ".pdf") {
    contentType = "application/pdf";
  }

  // Redirect to the statically-served file. fetch() follows redirects,
  // so the frontend blob-download approach works without server-side streaming.
  res.setHeader("Content-Type", contentType);
  res.redirect(302, `/${safeFilename}`);
}
