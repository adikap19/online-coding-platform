import Editor from "@monaco-editor/react";
import { handleEditorWillMount } from "../utils/editorConfig";

export default function EditorWrapper({ code, onChange, role }) {
  return (
    <div className="cb__editorWrap">
      <Editor
        height="60vh"
        language="javascript"
        path="script.js"
        theme="vs-dark"
        value={code}
        onChange={onChange}
        beforeMount={handleEditorWillMount}
        options={{
          readOnly: role === "mentor",
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: true,
          padding: { top: 16, bottom: 12 },
          fixedOverflowWidgets: true,
          overviewRulerBorder: false,
          roundedSelection: true,
          cursorSmoothCaretAnimation: "on",
        }}
      />
    </div>
  );
}
