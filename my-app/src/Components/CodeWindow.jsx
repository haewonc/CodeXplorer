
import React from 'react';
import { useRef, useState, useEffect } from "react";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-python'; 
import 'prismjs/themes/prism-tomorrow.css';

function CodeWindow({ codeContent, activeFile, updateCodeContent }) {
    const [code, setCode] = useState(codeContent);
    const editorRef = useRef(null);
    const textareaRef = useRef(null);

    const change = (codes) => {
        setCode(codes);
        updateCodeContent(codes, activeFile);
    }

    useEffect(() => {
        setCode(codeContent);
      }, [codeContent]);
    
    return (
    <div className='codeContainer'>
        <div className='editorContainer'>
            <Editor
                value={code}
                onValueChange={code => change(code)}
                highlight={code => highlight(code, languages.python)}
                padding={15}
                style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 13,
                color: '#d4d4d4',
                height: '100%',
                width: '100%',
            }}
        />
        </div>
    </div>
    );
}
export default CodeWindow;