import "../stylesheets/askAIBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'


const AskAIBar = () => {
  return (
    <div className="askAIBar">
      <div className="askAIContainer">
        <input 
          type="text" 
          className="askAISearch" 
          id="search" 
          name="search" 
          placeholder="Enter your purpose..."
        />
        <button className="askAIButton"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
      </div>
    </div>
  );
};

export default AskAIBar;