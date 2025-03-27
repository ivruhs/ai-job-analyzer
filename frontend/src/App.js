import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import ErrorBoundary from "./ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
export default App;
