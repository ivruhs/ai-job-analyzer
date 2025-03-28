const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const PDFParser = require("pdf2json");
const fs = require("fs").promises;
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(morgan("dev")); // Request logging

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/parse-pdf", async (req, res) => {
  if (!req.files || !req.files.pdfFile) {
    return res.status(400).json({ error: "No PDF file uploaded" });
  }

  const pdfFile = req.files.pdfFile;
  let extractedText = "";

  // Step 1: Parse PDF with pdf2json (for text-based PDFs)
  try {
    console.log("Attempting to parse PDF with pdf2json...");
    const pdfParser = new PDFParser();
    extractedText = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData) => {
        reject(new Error(`pdf2json error: ${errData.parserError}`));
      });
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        let text = "";
        pdfData.Pages.forEach((page) => {
          page.Texts.forEach((textItem) => {
            text += decodeURIComponent(textItem.R[0].T) + " ";
          });
          text += "\n";
        });
        resolve(text);
      });

      pdfParser.parseBuffer(pdfFile.data);
    });
    console.log("pdf2json parsing successful");
  } catch (error) {
    console.error("pdf2json failed:", error.message);
    return res
      .status(500)
      .json({ error: `Failed to parse PDF: ${error.message}` });
  }

  // Step 2: Check if text was extracted
  if (!extractedText.trim()) {
    return res.status(400).json({
      error:
        "No text could be extracted from the PDF. Scanned PDFs are not supported yet (OCR support will be added in a future update).",
    });
  }

  res.json({ text: extractedText });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
