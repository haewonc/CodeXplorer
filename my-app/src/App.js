import React, { useState } from 'react';
import "./App.css";
import "./stylesheets/codeWindow.css";

import LeftNav from "./Components/LeftNav";
import ExplorerBar from "./Components/ExplorerBar";
import TabBar from "./Components/TabBar";
import AskAIBar from "./Components/AskAIBar";
import CodeWindow from "./Components/CodeWindow";
import RemoteWindowButton from "./Components/RemoteWindowButton";
import BottomBar from "./Components/BottomBar";

import { fetchGitHubRepoContents } from './Functions/GitHubContents';
import { processTree } from './Functions/ProcessPaths';
import jsonData from './nodes.json'
import files from './files.json'
import fileContents from './fileContents.json'

const repo = await processTree(files, fileContents);
const repo2 = [repo, repo];
const node2 = [jsonData, jsonData];
const repoNames = ['CodeXplorer', 'CodeXplorer'];
// const repoTree = {'folders': {'Folder 1': {'folders': {}, 'files': {'two.py': 'import pandas as pd\nprint("A")'}}}, 'files': {'sheet.py': 'import numpy as np\na=[1,2,3,4]\na=np.array(a)'}};

function findKey(obj, targetKey, content) {
	if (obj.files && obj.files[targetKey] !== undefined) {
	  obj.files[targetKey] = content;
	  return obj;
	}

	for (const folder in obj.folders) {
	  const updatedFolder = findKey(obj.folders[folder], targetKey, content);
	  if (updatedFolder) {
		obj.folders[folder] = updatedFolder;
		return obj;
	  }
	}
  
	return null;
  }  

function App() {
	const [codeContent, setCodeContent] = useState(''); // State variable for code content
	const [activeFile, setActiveFile] = useState('')
	const [page, setPage] = useState(3);
	const [repoTree, setrepoTree] = useState('');
	const [nodeTree, setnodeTree] = useState('');
	const [repoName, setrepoName] = useState('');

	const updateCodeContent = (newContent, activeFile) => {
	  setCodeContent(newContent);
	  setActiveFile(activeFile);
	  setrepoTree(findKey(repoTree, activeFile, newContent));
	//   console.log(repoTree);
	};

	const updatePage = (num) => {
		setPage(num);
		setrepoTree(repo2[num]);
		setnodeTree(node2[num]);
		setrepoName(repoNames[num]);
	}

	return (
		<div>
		  {page == 3 ? (
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
				<div id="firstPage">
					<button style={{ backgroundColor: 'white', fontSize: '24px' }} onClick={() => updatePage(0)}>First Repository</button>
					<br/> <br/>
					<button style={{ backgroundColor: 'white', fontSize: '24px' }} onClick={() => updatePage(1)}>Second Repository</button>
				</div>
			</div>
		  ) : (
			<div>
			  <div className="noselect">
				<LeftNav />
				<ExplorerBar repoTree={repoTree} nodeTree={nodeTree} updateCodeContent={updateCodeContent} repoName={repoName} />
				<AskAIBar />
				<TabBar activeFile={activeFile} />
			  </div>
			  {activeFile !== '' && <CodeWindow codeContent={codeContent} activeFile={activeFile} updateCodeContent={updateCodeContent} />}
			  <div className="noselect">
				<RemoteWindowButton />
				<BottomBar />
			  </div>
			</div>
		  )}
		</div>
	  );	  
}

export default App;
