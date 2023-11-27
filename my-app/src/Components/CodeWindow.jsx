import React, { useRef, useState } from "react";
import "../stylesheets/codeWindow.css";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
// import LoadingIndicator from "./LoadingIndicator";

function CodeWindow({ codeContent, nodeTree }) {
  // const [loaded, setLoaded] = useState(false);
  const [code, setCode] = useState(codeContent);
  const textareaRef = useRef(null);

  return (
    <div
      className="codeWindow"
      role="button"
      tabIndex={0}
      onKeyDown={() => textareaRef.current?.focus()}
      onClick={() => textareaRef.current?.focus()}
    >
      <div className="scrollContainer">
        <textarea
          className="codeWindowTextArea"
          ref={textareaRef}
          spellCheck={false}
          defaultValue={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <SyntaxHighlighter
          language="python"
          style={a11yDark}
          children={code}
          customStyle={{
            background: "transparent",
            minHeight: "100%",
            fontSize: "14px",
            lineHeight: "normal",
            paddingTop: "10px",
            paddingLeft: "20px",
            margin: 0,
            whiteSpace: "pre-wrap",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
      {/* {loaded === false ? <LoadingIndicator /> : null} */}
    </div>
  );
}

export default CodeWindow;
