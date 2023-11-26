import "../stylesheets/tabBar.css";

const TabBar = (activeFile) => {
    return (
    <div className="tabBar">
    <div style={{ textAlign: 'right' }}> 
        <input type="text" id="search" name="search" placeholder="Enter your search query..."></input>
    </div>
    <p className="tabActive">{activeFile['activeFile']}</p>
    </div>
 );
 };
 
 export default TabBar;