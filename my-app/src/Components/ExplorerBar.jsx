import "../stylesheets/explorerBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont, faFile, faCircleUser, faCube, faRefresh} from '@fortawesome/free-solid-svg-icons';
import { processSource } from "../Functions/ProcessPaths";

function NodeView({ repoTree, nodeTree, results, depth, idx, filteredNodeTree, updateCodeContent }) {
	if (nodeTree.length === 0) {
	  return null;
	}

	const handleClick = (idx, fileName, repoTree, code) => {
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

				for (const contSplit of contentSplit) {

					if (contSplit === code) {
						scrollNum = 10 * count;
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
				<div key={idx} className="folder-name" style={{paddingLeft: `${generateSpaces}px`}} onClick={() => handleClick(idx, fileName, repoTree, code)}>
                <h3 className={`${highlightClass ? "highlightNode" : ""}`}>
                    {type === 'variable' && <FontAwesomeIcon icon={faFont} style={{marginRight: '3px'}}/>}
                    {first.name === '__main__' && <FontAwesomeIcon icon={faFile} style={{marginRight: '3px'}}/>}
                    {type === 'class' && <FontAwesomeIcon icon={faCircleUser} style={{marginRight: '3px'}}/>}
                    {type === 'function' && first.name !== '__main__' && <FontAwesomeIcon icon={faCube} style={{marginRight: '3px'}}/>}
                    {name}
                </h3>
				</div>
				<div>
				{(children.length > 0) && children.filter((element) => filteredNodeTree.includes(element)).map((child) => (
					// <div key={child} className="file-name" style={{paddingLeft: `${generateSpaces}px`}}>
						<NodeView repoTree={repoTree} results={results} nodeTree={nodeTree} depth={depth + 1} filteredNodeTree={filteredNodeTree} idx={child} updateCodeContent={updateCodeContent} />
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

    const reloadClick = () => {
        setLoading(true);
        fetch('https://14.52.35.74/treeUpdate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(repoTree),
        })
          .then(response => response.json())
          .then(data => {
            const procData = [];
            for (const snippet of data) {
                const procSnippet = snippet;
                procSnippet.source = processSource(procSnippet.source);
                procData.push(procSnippet);
            }
            setnodeTree(procData);
            setnodeTree(nodeTree);
            setResults({idx: [], name: [], how: {}});
            setLoading(false);
            console.log('Respond:', data);
          })
          .catch((error) => {
              console.error('Error: ', error);
              setLoading(false);
          });
    }

    const filteredNodeTree = [];

    function childrenContains(node, idx) {
        if (node.idx === idx) return true;
        else if(node.children.includes(idx)) return true;
        else {
            for (const child of node.children){
                if(childrenContains(nodeTree[child], idx)) return true;
            }
        }
        return false;
    }

    function filterNode(node){
        for (const nodeIdx of results.idx){
            if(childrenContains(node, nodeIdx)) return true;
        }
        return false;
    }

    for(const node of nodeTree){
        if (!props.isTask) {
            filteredNodeTree.push(node.idx);
        } else if (filterNode(node)){
            console.log(node)
            filteredNodeTree.push(node.idx);
        }
    }

    // console.log(nodeTree.filter((element) => element.name === '__main__'))
	return (
		<>
			<div className="explorerBar">
				<p className="explorerBarHeading">EXPLORER</p>
				<span className="explorerLevelWorkspace">› WORKSPACE (WORKSPACE)</span>
				<span className="explorerLevelWorkspace"> {rootFolderName} </span>
				<div className="scrollable-container">
                {!loading && nodeTree.filter((element) => element.name === '__main__' && filteredNodeTree.includes(element.idx)).map((node) => (
					// <div key={child} className="file-name" style={{paddingLeft: `${generateSpaces}px`}}>
                    <NodeView repoTree={repoTree} results={results} nodeTree={nodeTree} filteredNodeTree={filteredNodeTree} idx={node.idx} depth={0} updateCodeContent={updateCodeContent} />
					// </div>
				))}
					
				</div>
                <div className="button-container">
                    {!props.isTask && <button onClick={reloadClick} className="doneButton">Reload <FontAwesomeIcon icon={faRefresh} /></button>}
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
