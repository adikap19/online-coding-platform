import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lobby from "./pages/Lobby/Lobby.jsx";
import CodeBlock from "./pages/CodeBlock/CodeBlock.jsx";
import "./styles/theme.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/block/:id" element={<CodeBlock />} />
      </Routes>
    </BrowserRouter>
  );
}
