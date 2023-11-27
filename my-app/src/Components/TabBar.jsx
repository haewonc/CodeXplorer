import "../stylesheets/tabBar.css";

const TabBar = (activeFile) => {
    return (
    <div className="tabBar">
        <p className="tabActive">{activeFile['activeFile']}</p>
    </div>
 );
 };
 
 export default TabBar;