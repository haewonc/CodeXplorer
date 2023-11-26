import "../stylesheets/breadCrumbBar.css";

const BreadCrumbBar = () => {
	return (
		<div className="breadCrumbBar">
			<p className="breadcrumbBarText">{"reddit"}</p>
			<p className="breadcrumbBarText">{"ᐳ"}</p>
			<p className="breadcrumbBarText">{"popular"}</p>
			<p className="breadcrumbBarText">{"ᐳ"}</p>
			<p className="breadcrumbBarText">{"hot"}</p>
			<p className="breadcrumbBarText">{"ᐳ"}</p>
			<p className="breadcrumbBarText">{"past 24 hours"}</p>
		</div>
	);
};

export default BreadCrumbBar;
