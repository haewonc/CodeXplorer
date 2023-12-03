import "../stylesheets/explorerBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont, faFile, faCircleUser, faCube, faRefresh} from '@fortawesome/free-solid-svg-icons';

function NodeView({ repoTree, nodeTree, results, depth, idx, updateCodeContent }) {
	if (nodeTree.length === 0) {
	  return null;
	}

	const handleClick = (idx, fileName, nodeTree, repoTree, code) => {
		let temp = repoTree;
		let content = '';
		let scrollNum = 0;

		for (const item of sourceSplit) {
			if (temp.folders[item]) {
				temp = temp.folders[item];
			}
			else {
				temp = temp.files;
				content = temp[fileName];
				let contentSplit = JSON.stringify(content).split('\\n');
				let count = 0;
                let breakOut = false;

                for (let index = 0; index < contentSplit.length; index++){
                    const contSplit = contentSplit[index];
                    if (breakOut) break;
					if (contSplit.replace(/\s/g, "") !== "" && code.replace(/\s/g, "").startsWith(contSplit.replace(/\s/g, ""))) {
                        if (nodeTree[idx].type === 'function' && code.includes("__init__")) {
                            let parentClass = nodeTree[nodeTree[idx].parent_class].name;
                            for (let j = Math.max(index-3, 0); j < index; j++){
                                if(contentSplit[j].replace(/\s/g, "").includes(parentClass)){
                                    scrollNum = Math.floor(19.4 * count);
                                    console.log(code.replace(/\s/g, ""));
                                    console.log(contSplit.replace(/\s/g, ""));
                                    console.log(scrollNum);
                                    breakOut = true;
                                    break;
                                }
                            }
                        } else {
                            scrollNum = Math.floor(19.4 * count);
                            console.log(code.replace(/\s/g, ""));
                            console.log(contSplit.replace(/\s/g, ""));
                            console.log(scrollNum);
                        }
					}
					count = count + 1;
				}
				updateCodeContent(content, fileName, scrollNum);
			}
		};
	};

	const first = nodeTree[idx];

	const generateSpaces = 30 + (depth * 10);
	const type = first.type;
	const code = first.code;

	const source = first.source;
	const sourceSplit = source.split('/');
	const fileName = sourceSplit[sourceSplit.length - 1];
	const name = first.name === '__main__' ? fileName : first.name;

	const children = first.children;
    const highlightClass = results.idx.includes(idx);

	return (
	  <div>
		<div>
			<div>
				<div key={idx} className={`${type === 'variable' ? "variable-name" : "folder-name"}`} style={{paddingLeft: `${generateSpaces}px`}} onClick={() => {
                    if(type !== 'variable'){
                        handleClick(idx, fileName, nodeTree, repoTree, code)
                    } }}>
                <h3 className={`${highlightClass ? "highlightNode" : ""}`}>
                    {type === 'variable' && <FontAwesomeIcon icon={faFont} style={{marginRight: '3px'}}/>}
                    {first.name === '__main__' && <FontAwesomeIcon icon={faFile} style={{marginRight: '3px'}}/>}
                    {type === 'class' && <FontAwesomeIcon icon={faCircleUser} style={{marginRight: '3px'}}/>}
                    {type === 'function' && first.name !== '__main__' && <FontAwesomeIcon icon={faCube} style={{marginRight: '3px'}}/>}
                    {name}
                </h3>
				</div>
				<div>
				{(children.length > 0) && children.map((child) => (
					// <div key={child} className="file-name" style={{paddingLeft: `${generateSpaces}px`}}>
						<NodeView repoTree={repoTree} results={results} nodeTree={nodeTree} depth={depth + 1} idx={child} updateCodeContent={updateCodeContent} />
					// </div>
				))}
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
		updateCodeContent(content, fileName, 0);
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
    const loading = props.loading;
    const setLoading = props.setLoading;
    console.log(repoTree);
	const rootFolderName = nodeTree[0].source.split('/')[0];
	const repoName = props.repoName;

    // console.log(nodeTree.filter((element) => element.name === '__main__'))
	return (
		<>
			<div className="explorerBar">
				<p className="explorerBarHeading">EXPLORER</p>
				<span className="explorerLevelWorkspace">› WORKSPACE (WORKSPACE)</span>
				<span className="explorerLevelWorkspace"> {rootFolderName} </span>
				<div className="scrollable-container">
                {!loading && nodeTree.filter((element) => element.name === '__main__' && props.activeFile !== "" && element.source.includes(props.activeFile)).map((node) => (
					// <div key={child} className="file-name" style={{paddingLeft: `${generateSpaces}px`}}>
                    <NodeView repoTree={repoTree} results={results} nodeTree={nodeTree} idx={node.idx} depth={0} updateCodeContent={updateCodeContent} />
					// </div>
				))}
					
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
