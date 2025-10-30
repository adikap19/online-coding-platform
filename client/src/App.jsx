import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Lobby from "./pages/Lobby/Lobby.jsx";
import CodeBlock from "./pages/CodeBlock/CodeBlock.jsx";

function Navbar() {
  const location = useLocation();
  const isCodeBlockPage = location.pathname.startsWith("/block/");

  // נציג את הקישור רק אם אנחנו בעמוד קוד
  if (!isCodeBlockPage) return null;

  return (
    <nav style={{ padding: 10, fontFamily: "sans-serif", textAlign: "left" }}>
      <Link
        to="/"
        style={{ textDecoration: "none", color: "#007bff", fontWeight: "bold" }}
      >
        ← Back to Lobby
      </Link>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/block/:id" element={<CodeBlock />} />
      </Routes>
    </BrowserRouter>
  );
}
