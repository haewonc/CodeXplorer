import "../stylesheets/askAIBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faHome,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";

const AskAIBar = ({ returnMain }) => {
  return (
    <div className="askAIBar justify-between justify-center">
        <div className="askAIContainer" style={{width: '100%'}}>
            <input 
            type="text" 
            className="askAISearch flex-grow mr-2 w-auto max-w-xs" 
            id="search" 
            name="search" 
            placeholder="Enter your purpose..."
            />
            <button className="iconButton">Ask AI <FontAwesomeIcon icon={faMagnifyingGlass} /></button>
        </div>
        <div className="askAIContainer" style={{width: '30%'}}>
            <button onClick={() => {returnMain(true)}} className="iconButton mr-4">View Tasks <FontAwesomeIcon icon={faInfo} /></button>
            <button onClick={() => {returnMain(true)}} className="iconButton">Return <FontAwesomeIcon icon={faHome} /></button>
        </div>
    </div>
  );
};

export default AskAIBar;
