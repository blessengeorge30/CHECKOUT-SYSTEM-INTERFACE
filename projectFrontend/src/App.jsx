import { drawRect } from "./utilities";
import Camera from "./Camera";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import { useState } from "react";

function App() {
  const [objects, setObjects] = useState([]);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/camera/:id"
            element={<Camera objects={objects} setObjects={setObjects} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
