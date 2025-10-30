import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import "./CodeBlock.css";

export default function CodeBlock() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("Loading...");
  const [code, setCode] = useState("// initial code here");

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
    <div className="codeblock-container">
      <h2>{title}</h2>
      <Editor
        height="70vh"
        defaultLanguage="javascript"
        value={code}
        onChange={(v) => setCode(v)}
        options={{ minimap: { enabled: false } }}
      />
      <button onClick={() => navigate("/")}>Back to Lobby</button>
    </div>
  );
}
