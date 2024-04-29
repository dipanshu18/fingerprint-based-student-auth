import { BrowserRouter, Routes, Route } from "react-router-dom";
import Students from "./pages/Students";
import RegisterStudent from "./pages/RegisterStudent";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Students />} />
        <Route path="/register" element={<RegisterStudent />} />
      </Routes>
    </BrowserRouter>
  );
}
