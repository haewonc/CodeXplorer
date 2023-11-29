import React, { useState } from "react";
import "./App.css";
import "./stylesheets/codeWindow.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faSpinner, faGear } from '@fortawesome/free-solid-svg-icons'
import LeftNav from "./Components/LeftNav";
import ExplorerBar from "./Components/ExplorerBar";
import TabBar from "./Components/TabBar";
import AskAIBar from "./Components/AskAIBar";
import CodeWindow from "./Components/CodeWindow";
import RemoteWindowButton from "./Components/RemoteWindowButton";
import BottomBar from "./Components/BottomBar";

import { fetchGitHubRepoContents } from "./Functions/GitHubContents";
import { processTree, processSource } from "./Functions/ProcessPaths";
import jsonData1 from "./nodes1.json";
import jsonData2 from "./nodes2.json";
import files1 from "./files1.json";
import fileContents1 from "./fileContents1.json";
import files2 from "./files2.json";
import fileContents2 from "./fileContents2.json";

// const {files1, fileContents1} = fetchGitHubRepoContents('haewonc', 'example1', 'main');
// const {files2, fileContents2} = fetchGitHubRepoContents('stdeguzman', 'example2', 'main');

const repo1 = await processTree(files1, fileContents1);
const repo2 = await processTree(files2, fileContents2);
const repoList = [repo1, repo2]; // local var; don't pass it
const nodeList = [jsonData1, jsonData2];
const repoInfoList = [
  { name: "example1", desc: "Compare and Visualize Linear regression models", task1: "Add normalization to Price variable", task2: "Store performance of all models"},
  { name: "example2", desc: "Analyze and Print Weather Data", task1: "Add humidity threshold (80) to extreme event", task2: "Format the date to %Y-%m-%d when printing date"},
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
  const [isGithub, setIsGithub] = useState(false);
  const [isIndex, setIsIndex] = useState(true);
  const [results, setResults] = useState({idx: [], name: [], how: {}});
  const [repoNum, setRepoNum] = useState(-1);
  const [repoTree, setrepoTree] = useState("");
  const [nodeTree, setnodeTree] = useState("");
  const [repoName, setrepoName] = useState("");
  const [loading, setLoading] = useState(false);
  const [scrollNum, setScrollNum] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleGetValue = async () => {
    let input = inputValue.split('/')
    let owner = '';
    let repoName = '';
    let branch = '';
    let folderPath = '';
    let check = '';

    for (const names of input) {
      console.log(names);
      if (names === 'github.com') {
        check = 'owner';
        continue;
      }

      if (check === 'owner') {
        owner = names;
        check = 'repoName';
      } else if (check === 'repoName') {
        repoName = names;
        check = 'branch';
      } else if (names !== 'tree' && check === 'branch') {
        branch = names;
        check = 'folderPath';
      } else if (check === 'folderPath' && folderPath === '') {
        folderPath = folderPath + names;
      } else if (check === 'folderPath' && folderPath !== '') {
        folderPath = folderPath + '/' + names;
      }
    }
    setIsIndex(false);
    setLoading(true);
    
fetchGitHubRepoContents(owner, repoName, branch)
    .then(({ files, fileContents }) => {
      let newFiles = files.filter((item) => !item.startsWith(folderPath));
      let newFileContents = {};
  
      for (const key of fileContents) {
        if (newFiles.includes(key)) {
          newFileContents[key] = fileContents[key];
        }
      }
  
      const repo = processTree(newFiles, newFileContents);
      setIsIndex(false);
      setRepoNum(3);
      setResults({idx: [], name: [], how: {}});
      setrepoTree(repo);
    })
    .catch((error) => {
      console.error("Error fetching GitHub repository contents:", error);
    });
    
  };

  const updateCodeContent = (newContent, activeFile, scrollNum) => {
    setCodeContent(newContent);
    setActiveFile(activeFile);
    setrepoTree(findKey(repoTree, activeFile, newContent));
    setScrollNum(scrollNum);
  };

const updatePage = (num) => {
    setLoading(true);
    setActiveFile("");
    setRepoNum(num);
    setResults({idx: [], name: [], how: {}});
    setrepoTree(repoList[num]);
    // setnodeTree(nodeList[num]);
    fetch('https://14.52.35.74/treeUpdate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(repoList[num]),
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
            setrepoName(repoInfoList[num].name);
            setIsIndex(false);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error: ', error);
            setLoading(false);
        });
  };

  return (
    <div>
      {isIndex ? (
        <div className="flex flex-col items-center justify-center h-screen">
        <div id="firstPage" className="text-center">
          <h1 className="text-5xl font-bold mb-6">CodeXplorer</h1>
          <p className="text-2xl mb-12">Accelerate Programming with an AI-Assisted Codebase Navigation System</p>
          <div className="grid grid-cols-2 gap-8 items-center justify-center">
            {repoInfoList.map((repo, index) => (
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
          <div className="flex items-center justify-center mt-10">
            <div className="rounded shadow-lg px-6 py-4 bg-gray-700" style={{width:"300px"}}>
                <h2 className="font-bold text-xl mb-2">Load Your Repo</h2>
                <div className="mb-4">
                    <FontAwesomeIcon size='2xl' icon={faGear}/>
                </div>
                <input
                  type="text"
                  style={{color: '#222222', 'borderRadius': '6px', 'padding': '2px', 'fontSize': '14px'}}
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Enter repository link"
                />
                <p className="mt-4 font-bold">Currently Developing...</p>
            </div>
            </div>
        </div>
      </div>       
      ) : (
        <div>
          <div className="noselect">
            <LeftNav />
            {!loading && (<ExplorerBar
              repoTree={repoTree}
              nodeTree={nodeTree}
              results={results}
              setResults={setResults}
              setnodeTree={setnodeTree}
              isTask={isTask}
              isGithub={isGithub}
              loading={loading}
              setLoading={setLoading}
              updateCodeContent={updateCodeContent}
              repoName={repoName}
            />)}
            {!loading && (<AskAIBar setIsIndex={setIsIndex} isGithub={isGithub} isTask={isTask} nodeTree={nodeTree} setResults={setResults} setIsTask={setIsTask} setnodeTree={setnodeTree} loading={loading}
              setLoading={setLoading} repoInfo={repoInfoList[repoNum]}/>)}
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
      {
        loading && 
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed', 
            top: 0, 
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
            zIndex: 1000, 
            color: 'white', 
            fontSize: '1.5em'
          }}>
            <FontAwesomeIcon size='2xl' icon={faSpinner} spin className="mr-6"/> Loading...
          </div>
      }
    </div>
    
  );
}

export default App;
