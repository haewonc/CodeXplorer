import "../stylesheets/leftNav.css";
import LeftNavButton from "./LeftNavButton";

import React, { useState } from "react";

const LeftNav = () => {
	const navPages = [
		"Files",
		"Search",
		"SourceControl",
		"Debug",
		"RemoteExplorer",
		"Extensions",
		"Account",
		"Settings",
	];

	const [activeWindow, setActiveWindow] = useState("Files");

	const navButtonClicked = (active) => {
		console.log(active)
		setActiveWindow(active)
	};

	// active window prop...

	return (
		<div className="leftNav">
			{navPages.map((page) => (
				<LeftNavButton page={page} key={page} navButtonClicked={navButtonClicked} isActive={activeWindow === page}/>
			))}
		</div>
	);
};

export default LeftNav;
