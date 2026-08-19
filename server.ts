import express from "express";
import fs from "node:fs";
import path from "node:path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // CORS headers
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Dedicated download endpoint with explicit headers & attachment disposition
  app.get("/api/download", (req, res) => {
    const rawFile = (req.query.file as string) || "TM-Pick-n-Pay-Express.pptx";
    let safeFilename = path.basename(rawFile);
    if (safeFilename === "TM-Pick-n-Pay-Express.ppt") {
      safeFilename = "TM-Pick-n-Pay-Express.pptx";
    }

    const publicPath = path.join(process.cwd(), "public", safeFilename);
    const distPath = path.join(process.cwd(), "dist", safeFilename);

    let targetPath = fs.existsSync(publicPath) ? publicPath : fs.existsSync(distPath) ? distPath : null;

    if (!targetPath) {
      return res.status(404).json({ error: "File not found" });
    }

    // Set MIME types explicitly
    const ext = path.extname(safeFilename).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".pptx") {
      contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    } else if (ext === ".pdf") {
      contentType = "application/pdf";
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);

    res.sendFile(targetPath, (err) => {
      if (err && !res.headersSent) {
        res.status(500).json({ error: "Error sending file" });
      }
    });
  });

  // Base64 JSON fallback endpoint for restricted iframe environments
  app.get("/api/download-base64", (req, res) => {
    const rawFile = (req.query.file as string) || "TM-Pick-n-Pay-Express.pptx";
    const safeFilename = path.basename(rawFile);

    const publicPath = path.join(process.cwd(), "public", safeFilename);
    const distPath = path.join(process.cwd(), "dist", safeFilename);

    let targetPath = fs.existsSync(publicPath) ? publicPath : fs.existsSync(distPath) ? distPath : null;

    if (!targetPath) {
      return res.status(404).json({ error: "File not found" });
    }

    try {
      const fileBuffer = fs.readFileSync(targetPath);
      const ext = path.extname(safeFilename).toLowerCase();
      let contentType = "application/octet-stream";
      if (ext === ".pptx") {
        contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      } else if (ext === ".ppt") {
        contentType = "application/vnd.ms-powerpoint";
      } else if (ext === ".pdf") {
        contentType = "application/pdf";
      }

      res.json({
        filename: safeFilename,
        contentType,
        data: fileBuffer.toString("base64"),
      });
    } catch {
      res.status(500).json({ error: "Failed to encode file" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
