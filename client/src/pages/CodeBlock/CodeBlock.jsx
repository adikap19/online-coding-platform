import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import "./CodeBlock.css";

export default function CodeBlock() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("Loading...");
  const [code, setCode] = useState("// initial code here...");

  useEffect(() => {
    const titles = {
      1: "Async case",
      2: "Array sum",
      3: "Reverse string",
      4: "Is prime",
    };
    setTitle(titles[id] || "Code Block");
  }, [id]);

  return (
    <div className="cb">
      <header className="cb__hero">
        <button className="cb__back" onClick={() => navigate("/")}>
          ← Back to Lobby
        </button>
        <h1 className="cb__title">Coding Session</h1>
        <p className="cb__subtitle">
          Now editing: <strong>{title}</strong>
        </p>
      </header>

      <section className="cb__panel">
        <h2 className="cb__sectionTitle">Code:</h2>

        <div className="cb__editorWrap">
          <Editor
            height="68vh"
            defaultLanguage="javascript"
            value={code}
            onChange={(v) => setCode(v ?? "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              roundedSelection: true,
              scrollBeyondLastLine: false,
              cursorSmoothCaretAnimation: "on",
            }}
          />
        </div>
      </section>
    </div>
  );
}
