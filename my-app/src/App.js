import React, { useState } from "react";
import "./App.css";
import "./stylesheets/codeWindow.css";

import LeftNav from "./Components/LeftNav";
import ExplorerBar from "./Components/ExplorerBar";
import TabBar from "./Components/TabBar";
import AskAIBar from "./Components/AskAIBar";
import CodeWindow from "./Components/CodeWindow";
import RemoteWindowButton from "./Components/RemoteWindowButton";
import BottomBar from "./Components/BottomBar";

import { fetchGitHubRepoContents } from "./Functions/GitHubContents";
import { processTree } from "./Functions/ProcessPaths";
import jsonData from "./nodes.json";
import files1 from "./files1.json";
import fileContents1 from "./fileContents1.json";
import files2 from "./files2.json";
import fileContents2 from "./fileContents2.json";

// const {files1, fileContents1} = fetchGitHubRepoContents('haewonc', 'example1', 'main');
// const {files2, fileContents2} = fetchGitHubRepoContents('stdeguzman', 'example2', 'main');

const repo1 = await processTree(files1, fileContents1);
const repo2 = await processTree(files2, fileContents2);
const repoList = [
  { name: "example1", tree: repo1, node: jsonData, desc: "Compare and Visualize Linear regression models", task1: "Add normalization to Price variable", task2: "Store performance of all models"},
  { name: "example1", tree: repo2, node: jsonData, desc: "Compare and Visualize Linear regression models", task1: "Add normalization to Price variable", task2: "Store performance of all models"},
];

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
  const [codeContent, setCodeContent] = useState(""); // State variable for code content
  const [activeFile, setActiveFile] = useState("");
  const [isTask, setIsTask] = useState(false);
  const [isIndex, setIsIndex] = useState(true);
  const [results, setResults] = useState({idx: [], name: [], how: {}});
  const [repoNum, setRepoNum] = useState(-1);
  const [repoTree, setrepoTree] = useState("");
  const [nodeTree, setnodeTree] = useState("");
  const [repoName, setrepoName] = useState("");
  const [scrollNum, setScrollNum] = useState(0);

  const updateCodeContent = (newContent, activeFile, scrollNum) => {
    setCodeContent(newContent);
    setActiveFile(activeFile);
    setrepoTree(findKey(repoTree, activeFile, newContent));
    setScrollNum(scrollNum);
  };

  const updatePage = (num) => {
    setIsIndex(false);
    setRepoNum(num);
    setResults({idx: [], name: [], how: {}});
    setrepoTree(repoList[num].tree);
    setnodeTree(repoList[num].node);
    setrepoName(repoList[num].name);
  };

  return (
    <div>
      {isIndex ? (
        <div className="flex flex-col items-center justify-center h-screen">
        <div id="firstPage" className="text-center">
          <h1 className="text-5xl font-bold mb-6">CodeXplorer</h1>
          <p className="text-2xl mb-12">Accelerate Programming with an AI-Assisted Codebase Navigation System</p>
          <div className="grid grid-cols-2 gap-8 items-center justify-center">
            {repoList.map((repo, index) => (
              <div key={index} className="max-w-md rounded overflow-hidden shadow-lg px-6 py-4 bg-gray-700">
                <h2 className="font-bold text-xl mb-2">{repo.name}</h2>
                <p className="text-gray-300 font-bold text-base">{repo.desc}</p>
                <p className="text-gray-300 text-base">Task 1: {repo.task1}</p>
                <p className="text-gray-300 text-base mb-4">Task 2: {repo.task2}</p>
                <button
                  className="bg-blue-500 text-base hover:bg-blue-700 font-bold py-1 px-2 rounded mx-2"
                  onClick={() => updatePage(index)}
                >
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>       
      ) : (
        <div>
          <div className="noselect">
            <LeftNav />
            <ExplorerBar
              repoTree={repoTree}
              nodeTree={nodeTree}
              results={results}
              setResults={setResults}
              setnodeTree={setnodeTree}
              isTask={isTask}
              updateCodeContent={updateCodeContent}
              repoName={repoName}
            />
            <AskAIBar returnMain={setIsIndex} isTask={isTask} nodeTree={nodeTree} setResults={setResults} setIsTask={setIsTask} setnodeTree={setnodeTree} repoInfo={repoList[repoNum]}/>
            <TabBar activeFile={activeFile} />
          </div>
          {activeFile !== "" && (
            <CodeWindow
              codeContent={codeContent}
              activeFile={activeFile}
              scroll={scrollNum}
              setnodeTree={setnodeTree}
              results={results}
              updateCodeContent={updateCodeContent}
            />
          )}
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
