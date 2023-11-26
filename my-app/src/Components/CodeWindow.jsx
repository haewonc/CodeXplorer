import React, { useState } from 'react';
import "../stylesheets/codeWindow.css";
import LoadingIndicator from "./LoadingIndicator";

function CodeWindow({ codeContent, nodeTree }) {
	const [loaded, setLoaded] = useState(false);

	return (
	  <div className="codeWindow">
		<div className="codeWindowContent" contentEditable="true">
		  <pre>{codeContent} </pre>
		</div>
		{/* {loaded === false ? <LoadingIndicator /> : null} */}
	  </div>
	);
  }

export default CodeWindow;
