import "../stylesheets/askAIBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faHome, faInfo, faCheck } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from 'react';
import Modal from './Modal';

const AskAIBar = ({ returnMain, repoInfo, isTask, setNodeTree, setIsTask }) => {
  const [showModal, setShowModal] = useState(false);

  const handleViewTasks = () => {
    setShowModal(true);
  };

  const handleAIClick = () => {
    setIsTask(true)
  }

  const handleDoneClick = () => {
    setIsTask(false)
  }

  return (
    <div className="askAIBar">
        <div className="askAIContainer flex-grow">
            <input 
                type="text" 
                className="askAISearch flex-grow mr-2" 
                id="search" 
                name="search" 
                placeholder="Enter your purpose..."
            />
            <button onClick={handleAIClick} className="iconButton aiButton">Ask AI <FontAwesomeIcon icon={faMagnifyingGlass} /></button>
            {isTask && <p style={{'width':'6px'}}></p>}
            {isTask && <button onClick={handleDoneClick} className="iconButton aiButton">Done <FontAwesomeIcon icon={faCheck} /></button>}
        </div>
        <div className="askAIContainer">
            <button onClick={handleViewTasks} className="iconButton">View Tasks <FontAwesomeIcon icon={faInfo} /></button>
            <p style={{'width':'6px'}}></p>
            <button onClick={() => {returnMain(true)}} className="iconButton">Return <FontAwesomeIcon icon={faHome} /></button>
        </div>
        <Modal 
            show={showModal} 
            onClose={() => setShowModal(false)} 
            task1={repoInfo.task1} 
            task2={repoInfo.task2}
        />
    </div>
  );
};

export default AskAIBar;
