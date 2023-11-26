import "../stylesheets/bottomBar.css";

const BottomBar = () => {
	return (
		<div className="bottomBar">
			<p className="seperatorTop"></p>
			<img className="bottomBarImage" src={require(`../images/source-control-2.svg`).default} alt="remote window button" />
			<p className="bottomBarText">main</p>
			<p className="seperator"></p>
			<img className="bottomBarImage" src={require(`../images/sync.svg`).default} alt="remote window button" />
			<p className="bottomBarText">0</p>
			<img className="bottomBarImage" src={require(`../images/arrow-down.svg`).default} alt="remote window button" />
			<p className="bottomBarText">1</p>
			<img className="bottomBarImage" src={require(`../images/arrow-up.svg`).default} alt="remote window button" />
			<p className="seperator"></p>
			<img className="bottomBarImage" src={require(`../images/error.svg`).default} alt="remote window button" />
			<p className="bottomBarText">0</p>
			<img className="bottomBarImage" src={require(`../images/warning.svg`).default} alt="remote window button" />
			<p className="bottomBarText">0</p>
		</div>

	);
};

export default BottomBar;
