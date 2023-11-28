import "../stylesheets/askAIBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faHome, faInfo } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from 'react';
import Modal from './Modal';

const AskAIBar = ({ returnMain, repoInfo }) => {
  const [showModal, setShowModal] = useState(false);

  const handleViewTasks = () => {
    setShowModal(true);
  };

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
            <button className="iconButton">Ask AI <FontAwesomeIcon icon={faMagnifyingGlass} /></button>
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
