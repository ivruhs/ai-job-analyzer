import { useDropzone } from "react-dropzone";
import { useState } from "react";

function Analysis() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      if (file.type === "text/plain") {
        const text = await file.text();
        setResumeText(text);
      } else if (file.type === "application/pdf") {
        const formData = new FormData();
        formData.append("pdfFile", file);

        const response = await fetch("http://localhost:5001/parse-pdf", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setResumeText(data.text);
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

  const handleAnalyze = () => {
    console.log("Analyze button clicked");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Resume Analyzer
        </h1>

        {/* Resume Uploader Section */}
        <div className="mb-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Upload Your Resume
          </h2>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center hover:border-blue-500 transition"
          >
            <input {...getInputProps()} />
            <p className="text-gray-600">
              Drag & drop a resume (.txt or .pdf), or click to select
            </p>
          </div>
          {resumeText && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Resume Content:
              </h3>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                {resumeText}
              </pre>
            </div>
          )}
        </div>

        {/* Job Description Section */}
        <div className="mb-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Enter Job Description
          </h2>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            rows="6"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          {jobDescription && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Job Description:
              </h3>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                {jobDescription}
              </pre>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleAnalyze}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Analyze
          </button>
        </div>

        {/* Analysis Results Placeholder */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-medium text-gray-800 mb-4">
            Analysis Results
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">
                <strong>Summary:</strong> [Your resume match percentage will
                appear here]
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <strong>Common Keywords:</strong> [Keywords will appear here]
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <strong>Match Percentage:</strong> [Percentage will appear here]
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
