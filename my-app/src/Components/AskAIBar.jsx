import "../stylesheets/askAIBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faHome, faInfo, faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const AskAIBar = ({ setIsIndex, repoInfo, isTask, nodeTree, isGithub, setResults, loading, setLoading, setnodeTree, setIsTask }) => {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState(localStorage.getItem("search") || "");

  useEffect(() => {
    localStorage.setItem("search", inputValue);
  }, [inputValue]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const returnMain = () => {
    setIsIndex(true);
    setInputValue("");
    localStorage.removeItem("search");
    setIsTask(false);
  }

  const handleViewTasks = () => {
    setShowModal(true);
  };

  const handleAIClick = () => {
    setLoading(true);
    const results = {idx: [], name: [], how: {}};
    
    // fetching starts here
    let inputValue = document.getElementById("search").value;
    console.log('input: ', inputValue);

    fetch(`https://14.52.35.74/askai/${inputValue}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputValue),
    })
      .then(response => response.json())
      .then(data => {
          // Process the response data as needed
          console.log('Respond:', data);
          if (data.length == 0) {
            alert("No snippet identified. Retry with different prompt.")
            handleDoneClick();
            setLoading(false);
          }
          for (const snippet of data){
            const source = nodeTree[snippet.idx].source;
            const sourceSplit = source.split('/');
            const fileName = sourceSplit[sourceSplit.length - 1];
            if (!results.idx.includes(snippet.idx)){
                results.idx.push(snippet.idx);
                if (!results.name.includes(fileName)){ results.name.push(fileName); }
            }
            const parent = nodeTree[snippet.idx].parent_class;
            console.log(parent)
            const name = (parent != 'None' ? nodeTree[parent].name + " " : '') + nodeTree[snippet.idx].name;
            if (Object.keys(results.how).includes(fileName)){
                results.how[fileName].push([name, snippet.how]);
            } else {
                results.how[fileName] = [[name, snippet.how]];
            }
            console.log(results);
            setResults({...results});
            setIsTask(true);
            setLoading(false);
        }
      })
      .catch((error) => {
          console.error('AskAI Error: ', error);
          setLoading(false);
      });   
  }

  const handleDoneClick = () => {
    setResults({idx: [], name: [], how: {}});
    setShowModal(false);
    setInputValue("");
    localStorage.removeItem("search");
    setIsTask(false);
  }

  return (
    <div className="askAIBar">
        <div className="askAIContainer flex-grow">
            <input 
                type="text" 
                className="askAISearch flex-grow mr-2" 
                style={{color: '#222222'}}
                id="search" 
                name="search" 
                onChange={handleInputChange}
                value={inputValue}
                placeholder={"Enter your task..."}
            />
            {!isTask && <button onClick={handleAIClick} className="iconButton aiButton">Ask AI <FontAwesomeIcon icon={faMagnifyingGlass} /></button>}
            {isTask && <p style={{'width':'6px'}}></p>}
            {isTask && <button onClick={handleDoneClick} className="iconButton aiButton">Done <FontAwesomeIcon icon={faCheck} /></button>}
            {loading && <button className="iconButton aiButton">Loading <FontAwesomeIcon icon={faSpinner} /></button>}
        </div>
        <div className="askAIContainer">
            <button onClick={handleViewTasks} className="iconButton">View Tasks <FontAwesomeIcon icon={faInfo} /></button>
            <p style={{'width':'6px'}}></p>
            <button onClick={returnMain} className="iconButton">Return <FontAwesomeIcon icon={faHome} /></button>
        </div>
        {!isGithub && (<Modal 
            show={showModal} 
            onClose={() => setShowModal(false)} 
            task1={repoInfo.task1} 
            task2={repoInfo.task2}
        />)}
    </div>
  );
};

export default AskAIBar;
