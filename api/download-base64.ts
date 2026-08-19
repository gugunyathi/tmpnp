import path from "node:path";

// Vercel Serverless Function: /api/download-base64
// Redirects to the corresponding static file (same as /api/download).
// This endpoint exists as a fallback; the frontend fetches the file
// and base64-encodes it client-side if needed.
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

  res.redirect(302, `/${safeFilename}`);
}
