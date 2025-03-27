import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-6 max-w-lg mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Resume Analyzer
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Upload your resume and a job description to analyze how well they
          match. Get insights on common keywords, match percentage, and more!
        </p>
        <Link to="/analysis">
          <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
