import { useDropzone } from "react-dropzone";
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Set the worker script URL to the public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

function Analysis() {
  const [resumeText, setResumeText] = useState("");

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      if (file.type === "text/plain") {
        // Handle .txt files
        const text = await file.text();
        setResumeText(text);
      } else if (file.type === "application/pdf") {
        // Handle .pdf files
        const reader = new FileReader();
        reader.onload = async (e) => {
          const typedArray = new Uint8Array(e.target.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let extractedText = "";

          // Loop through each page of the PDF
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item) => item.str)
              .join(" ");
            extractedText += pageText + "\n";
          }

          setResumeText(extractedText);
        };
        reader.readAsArrayBuffer(file);
      } else {
        setResumeText(
          "Unsupported file type. Please upload a .txt or .pdf file."
        );
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setResumeText("Error reading the file. Please try again.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
    },
  });

  return (
    <div className="p-4">
      <div {...getRootProps()} className="border-2 border-dashed p-4">
        <input {...getInputProps()} />
        <p>Drag & drop a resume (.txt or .pdf), or click to select</p>
      </div>
      {resumeText && <pre className="mt-4">{resumeText}</pre>}
    </div>
  );
}

export default Analysis;
