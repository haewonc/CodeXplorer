import "../stylesheets/explorerBar.css";

function NodeView({ nodeTree, depth }) {
	if (nodeTree.length === 0) {
	  return null;
	}

	// "type": "function", 
	// "name": "__main__", 
	// "code": "data = pd.read_csv('data/house_prices.csv')\nX = data[['Area', 'Bedrooms', 'Bathrooms']]\ny = data['Price']\nmodels = [LinearRegression(), DecisionTreeRegressor()]\ncomparator = ModelComparator(models)\ncomparator.fit_and_evaluate(X_train, y_train, X_valid, y_valid)\nbest_model = comparator.get_best_model()\ntest_predictions = best_model.predict(X_test)\ntest_mse = mean_squared_error(y_test, test_predictions)\nprint(f'Test MSE of Best Model: {test_mse}')\nvisualizer = ResultVisualizer()\nvisualizer.vis_data(data)\nvisualizer.vis_preds(y_test, test_predictions)\nvisualizer.vis_feature_importance(best_model)", 
	// "source": "example1/main.py", 
	// "children": [1, 2, 3, 4, 5, 6, 7, 8, 9], 
	// "context": null}, 
	
	const first = nodeTree[0];

	const generateSpaces = 30 + (depth * 10);
	const idx = first.idx;
	const type = first.type;
	const code = first.code;

	const source = first.source;
	const sourceSplit = source.split('/');
	const fileName = sourceSplit[sourceSplit.length - 1];
	const name = first.name == '__main__' ? fileName : first.name;


	const children = first.children;
	const maxChild = children[children.length - 1] + 1;
	const nextNode = nodeTree.filter((element) => element.idx >= maxChild)
	const context = first.context;

	return (
	  <div>
		<div>
			<div>
				<div key={idx} className="folder-name" style={{paddingLeft: `${generateSpaces}px`}}>
				{'> ' + name}
				</div>
				<div>
				{children.map((child) => (
					// <div key={child} className="file-name" style={{paddingLeft: `${generateSpaces}px`}}>
						<NodeView nodeTree={nodeTree.filter((element) => element.idx >= child)} depth={depth + 1} />
					// </div>
				))}
				</div>
				<div>
					<NodeView nodeTree={nextNode} depth={depth} />
				</div>
			</div>
		</div>
	  </div>
	);
  } 

function TreeView({ repoTree, depth, updateCodeContent }) {
	if (!repoTree) {
	  return null;
	}

	const handleFileClick = (content, fileName) => {
		updateCodeContent(content, fileName);
	};
  
	const folders = repoTree['folders'];
	const files = repoTree['files'];
	const generateSpaces = 30 + (depth * 10);
	const folderNames = repoTree['folders'] ? Object.keys(folders) : [];
	const fileNames = repoTree['files'] ? Object.keys(files) : [];

	return (
	  <div>
		<div>
		  {folderNames.map((folderName) => (
			<div>
				<div key={folderName} className="folder-name" style={{paddingLeft: `${generateSpaces}px`}}>
				{'> ' + folderName}
				</div>
				<div>
					<TreeView repoTree={folders[folderName]} depth={depth + 1} updateCodeContent={updateCodeContent}/> {/* Recursively render nested folders */}
				</div>
			</div>
		  ))}
		</div>
		<div>
		  {fileNames.map((fileName) => (
			<div key={fileName} className="file-name" onClick={() => handleFileClick(files[fileName], fileName)} style={{paddingLeft: `${generateSpaces}px`}}>{fileName}</div>
		  ))}
		</div>
	  </div>
	);
  }  

const ExplorerBar = (props) => {
	const repoTree = props.repoTree;
	const updateCodeContent = props.updateCodeContent;
	const nodeTree = props.nodeTree;
	const rootFolderName = nodeTree[0].source.split('/')[0]
	const repoName = props.repoName;

	return (
		<>
			<div className="explorerBar">
				<p className="explorerBarHeading">EXPLORER</p>
				<span className="explorerLevelWorkspace">› WORKSPACE (WORKSPACE)</span>
				<span className="explorerLevelWorkspace"> {rootFolderName} </span>
				<div class="scrollable-container">
					<NodeView nodeTree={nodeTree} depth={0} />
				</div>
				<span className="explorerLevelWorkspace"> {repoName} </span>
				<div class="scrollable-container">
					<TreeView repoTree={repoTree} depth={0} updateCodeContent={updateCodeContent} />
				</div>
			</div>
		</>
	);
};

export default ExplorerBar;
