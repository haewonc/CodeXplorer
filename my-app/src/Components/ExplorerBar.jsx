import "../stylesheets/explorerBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont, faFile, faCircleUser, faCube, faCheck, faRefresh} from '@fortawesome/free-solid-svg-icons';

function NodeView({ repoTree, nodeTree, results, depth, updateCodeContent }) {
	if (nodeTree.length === 0) {
	  return null;
	}

	const handleClick = (idx, fileName, repoTree) => {
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
	const name = first.name === '__main__' ? fileName : first.name;


	const children = first.children;
	const maxChild = children[children.length - 1] + 1;
	const nextNode = nodeTree.filter((element) => element.idx >= maxChild)
	const context = first.context;
    const highlightClass = results.idx.includes(idx);

	return (
	  <div>
		<div>
			<div>
				<div key={idx} className="folder-name" style={{paddingLeft: `${generateSpaces}px`}} onClick={() => handleClick(idx, fileName, repoTree)}>
                <h3 className={`${highlightClass ? "highlightNode" : ""}`}>
                    {type === 'variable' && <FontAwesomeIcon icon={faFont} style={{marginRight: '3px'}}/>}
                    {first.name === '__main__' && <FontAwesomeIcon icon={faFile} style={{marginRight: '3px'}}/>}
                    {type === 'class' && <FontAwesomeIcon icon={faCircleUser} style={{marginRight: '3px'}}/>}
                    {type === 'function' && first.name !== '__main__' && <FontAwesomeIcon icon={faCube} style={{marginRight: '3px'}}/>}
                    {name}
                </h3>
				</div>
				<div>
				{children.map((child) => (
					// <div key={child} className="file-name" style={{paddingLeft: `${generateSpaces}px`}}>
						<NodeView repoTree={repoTree} results={results} nodeTree={nodeTree.filter((element) => element.idx >= child)} depth={depth + 1} updateCodeContent={updateCodeContent} />
					// </div>
				))}
				</div>
				<div>
					<NodeView repoTree={repoTree} results={results} nodeTree={nextNode} depth={depth} updateCodeContent={updateCodeContent} />
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
    const results = props.results;
    const setResults = props.setResults;
    const setnodeTree= props.setnodeTree;
	const rootFolderName = nodeTree[0].source.split('/')[0];
	const repoName = props.repoName;

    const reloadClick = () => {
        fetch('http://14.52.35.74/treeUpdate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(repoTree),
        })
          .then(response => response.json())
          .then(data => {
              // Process the response data as needed
              console.log('Respond:', data);
          })
          .catch((error) => {
              console.error('Error: ', error);
          });
        setResults({idx: [], name: [], how: {}});
        setnodeTree(nodeTree);
    }

	return (
		<>
			<div className="explorerBar">
				<p className="explorerBarHeading">EXPLORER</p>
				<span className="explorerLevelWorkspace">› WORKSPACE (WORKSPACE)</span>
				<span className="explorerLevelWorkspace"> {rootFolderName} </span>
				<div className="scrollable-container">
					<NodeView repoTree={repoTree} results={results} nodeTree={nodeTree} depth={0} updateCodeContent={updateCodeContent} />
				</div>
                <div className="button-container">
                    <button onClick={reloadClick} className="doneButton">Reload <FontAwesomeIcon icon={faRefresh} /></button>
                </div>
				<span className="explorerLevelWorkspace" style={{marginTop: '20px'}}> {repoName} </span>
				<div className="scrollable-container">
					<TreeView repoTree={repoTree} depth={0} updateCodeContent={updateCodeContent} />
				</div>
			</div>
		</>
	);
};

export default ExplorerBar;
