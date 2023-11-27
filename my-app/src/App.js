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

// const { files, fileContents } = await fetchGitHubRepoContents('stdeguzman', 'CodeXplorer-Fork', 'no-frontend');
// const repoTree = await processTree(files, fileContents);
const nodeTree = jsonData;
const repoName = 'CodeXplorer';
const repoTree = {'folders': {'Folder 1': {'folders': {}, 'files': {'two.py': 'import pandas as pd\nprint("A")'}}}, 'files': {'sheet.py': 'import numpy as np\na=[1,2,3,4]\na=np.array(a)'}};

function App() {
	const [codeContent, setCodeContent] = useState(''); // State variable for code content
	const [activeFile, setActiveFile] = useState('')

	const updateCodeContent = (newContent, activeFile) => {
	  setCodeContent(newContent);
	  setActiveFile(activeFile);
	};
	return (
		<div>
			<div className="noselect">
				<LeftNav />
				<ExplorerBar repoTree={repoTree} nodeTree={nodeTree} updateCodeContent={updateCodeContent} repoName={repoName}/>
				<AskAIBar />
                <TabBar activeFile={activeFile}/>
				
			</div>
			{activeFile !== '' && <CodeWindow codeContent={codeContent} />}
			<div className="noselect">
				<RemoteWindowButton />
				<BottomBar />
			</div>
		</div>
	);
}

export default App;
