import "../stylesheets/askAIBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faHome, faInfo, faCheck } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from 'react';
import Modal from './Modal';

const AskAIBar = ({ returnMain, repoInfo, isTask, nodeTree, isGithub, setResults, setNodeTree, setIsTask }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
          for (const snippet of data){
            const source = nodeTree[snippet.idx].source;
            const sourceSplit = source.split('/');
            const fileName = sourceSplit[sourceSplit.length - 1];
            if (!results.idx.includes(snippet.idx)){
                results.idx.push(snippet.idx);
                results.name.push(fileName);
            }
            if (Object.keys(results.how).includes(fileName)){
                results.how[fileName] += (' / '+snippet.how);
            } else {
                results.how[fileName] = snippet.how;
            }
        }
      })
      .catch((error) => {
          console.error('AskAI Error: ', error);
      });

    setResults(results);
    setIsTask(true);
    setLoading(false);
  }

  const handleDoneClick = () => {
    setResults({idx: [], name: [], how: {}});
    setIsTask(false);
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="askAIBar">
        <div className="askAIContainer flex-grow">
            <input 
                type="text" 
                className="askAISearch flex-grow mr-2" 
                id="search" 
                name="search" 
                placeholder="Enter your task..."
            />
            {!isTask && <button onClick={handleAIClick} className="iconButton aiButton">Ask AI <FontAwesomeIcon icon={faMagnifyingGlass} /></button>}
            {isTask && <p style={{'width':'6px'}}></p>}
            {isTask && <button onClick={handleDoneClick} className="iconButton aiButton">Done <FontAwesomeIcon icon={faCheck} /></button>}
        </div>
        <div className="askAIContainer">
            <button onClick={handleViewTasks} className="iconButton">View Tasks <FontAwesomeIcon icon={faInfo} /></button>
            <p style={{'width':'6px'}}></p>
            <button onClick={() => {returnMain(true)}} className="iconButton">Return <FontAwesomeIcon icon={faHome} /></button>
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
