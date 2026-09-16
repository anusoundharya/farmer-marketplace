import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

const basename = process.env.PUBLIC_URL || "/farmer-marketplace";

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;