import "../stylesheets/bottomBar.css";

const RemoteWindowButton = () => {
	return (
		<div className="remoteWindowButton">
			<img className="leftNavIcon" src={require(`../images/remote.svg`).default} alt="remote window button" />
		</div>
	);
};

export default RemoteWindowButton;
