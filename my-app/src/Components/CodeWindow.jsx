import React from 'react';
import { useRef, useState, useEffect } from "react";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-python'; 
import 'prismjs/themes/prism-tomorrow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'


const Popup = ({ onClose, content }) => {
    const handleCloseClick = (e) => {
        onClose();
    };

    return (
        <div className="popup">
            <div className="popupContent">
                {content}
                <p style={{'width': '4px'}}></p>
                <FontAwesomeIcon icon={faClose} onClick={handleCloseClick}/>
            </div>
        </div>
    );
};

function CodeWindow({ codeIndex, codeContent, scroll, activeFile, setnodeTree, results, updateCodeContent }) {
    const [code, setCode] = useState(codeContent);
    const [showPopup, setShowPopup] = useState(false);

    const editorRef = useRef(null);
    const textareaRef = useRef(null);
    const scrollableDivRef = useRef(null);

    const change = (codes, scroll) => {
        setCode(codes);
        updateCodeContent(codes, activeFile, scroll);
      };

    useEffect(() => {
        setCode(codeContent);
    }, [codeContent]);

    if(!showPopup && results.name.includes(activeFile)){
        setShowPopup(true);
    }

    useEffect(() => {
        setShowPopup(false);
        setCode(codeContent);
      }, [codeContent]);

    useEffect(() => {
      scrollableDivRef.current.scrollTop = scroll;
    })

    console.log(scroll);
    
    return (
    <div className="codeContainer scrollable-div" ref={scrollableDivRef}>
        {showPopup && (
            <Popup 
                onClose={() => {results.how[activeFile]=''; results.name.splice(results.name.indexOf(activeFile), 1); setShowPopup(false);}} 
                content={<div>{results.how[activeFile]}</div>}
            />
        )}
        <div className='editorContainer' >
            <Editor
                value={code}
                onValueChange={code => change(code, scrollableDivRef.current.scrollTop)}
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
