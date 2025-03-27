import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl">AI Job Application Analyzer</h1>
      <Link to="/analysis">
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Get Started
        </button>
      </Link>
    </div>
  );
}
export default Home;
