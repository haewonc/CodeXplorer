import "../stylesheets/explorerBar.css";
import "../stylesheets/explorerBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faFile, faCircleUser, faCube } from '@fortawesome/free-solid-svg-icons'

function NodeView({ repoTree, nodeTree, depth, updateCodeContent }) {
	if (nodeTree.length === 0) {
	  return null;
	}

	const handleClick = (fileName, repoTree) => {
		let temp = repoTree;
		let content = '';
		for (const item of sourceSplit) {
			if (temp.folders[item]) {
				temp = temp.folders[item];
			}
			else {
				temp = temp.files;
				content = temp[fileName];
				updateCodeContent(content, fileName);
			}
		};
	};

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
				<div key={idx} className="folder-name" style={{paddingLeft: `${generateSpaces}px`}} onClick={() => handleClick(fileName, repoTree)}>
				{type === 'variable' && <FontAwesomeIcon icon={faInfo} style={{marginRight: '3px'}}/>}
                {first.name === '__main__' && <FontAwesomeIcon icon={faFile} style={{marginRight: '3px'}}/>}
                {type === 'class' && <FontAwesomeIcon icon={faCircleUser} style={{marginRight: '3px'}}/>}
                {type === 'function' && first.name !== '__main__' && <FontAwesomeIcon icon={faCube} style={{marginRight: '3px'}}/>}
                {name}
				</div>
				<div>
				{children.map((child) => (
					// <div key={child} className="file-name" style={{paddingLeft: `${generateSpaces}px`}}>
						<NodeView repoTree={repoTree} nodeTree={nodeTree.filter((element) => element.idx >= child)} depth={depth + 1} updateCodeContent={updateCodeContent} />
					// </div>
				))}
				</div>
				<div>
					<NodeView repoTree={repoTree} nodeTree={nextNode} depth={depth} updateCodeContent={updateCodeContent} />
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
					<NodeView repoTree={repoTree} nodeTree={nodeTree} depth={0} updateCodeContent={updateCodeContent} />
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