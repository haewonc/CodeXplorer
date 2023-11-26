import "../stylesheets/leftNav.css";

// import React, { useState } from "react";

const LeftNavButton = (props) => {
	const active = props.page;

	const flexSeperator = <div className="flexSeperator" />;

	return (
		<>
			{props.page === "Account" ? flexSeperator : null}
			<div style={{ position: "relative" }}>
				<button
					className="leftNavButton"
					style={{ filter: `brightness(${props.isActive ? 120 : 65}%)` }}
					onClick={() => {
						props.navButtonClicked(active);
					}}
				>
					<img
						className="leftNavIcon"
						src={require(`../images/${props.page}.svg`)}
						alt={props.page}
					/>
				</button>
				{props.isActive ? <div className="activeRectangle"></div> : <div className="inactiveRectangle"></div>}
			</div>
		</>
	);
};

export default LeftNavButton;
