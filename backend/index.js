const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const PDFParser = require("pdf2json");

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/parse-pdf", async (req, res) => {
  if (!req.files || !req.files.pdfFile) {
    return res.status(400).json({ error: "No PDF file uploaded" });
  }

  const pdfFile = req.files.pdfFile;
  const pdfParser = new PDFParser();

  pdfParser.on("pdfParser_dataError", (errData) => {
    console.error("PDF parsing error:", errData);
    res.status(500).json({ error: "Error parsing PDF" });
  });

  pdfParser.on("pdfParser_dataReady", (pdfData) => {
    let extractedText = "";
    pdfData.Pages.forEach((page) => {
      page.Texts.forEach((text) => {
        const decodedText = decodeURIComponent(text.R[0].T);
        extractedText += decodedText + " ";
      });
      extractedText += "\n";
    });
    res.json({ text: extractedText });
  });

  pdfParser.parseBuffer(pdfFile.data);
});

const PORT = process.env.PORT || 5001; // Changed to 5001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
