import "../stylesheets/askAIBar.css";

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
        <button className="askAIButton">Ask AI!</button>
      </div>
    </div>
  );
};

export default AskAIBar;