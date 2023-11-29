async function processTree(files, fileContents) {
    const repoTree = {'folders': {}, 'files': {}};

    for (const filePath of files) {
      const pathSegments = filePath.split('/');
      let currentNode = repoTree;
  
      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        const isLastSegment = i === pathSegments.length - 1;

        if (isLastSegment) {
            currentNode['files'][segment] = fileContents[filePath];
        } else {
            if (!currentNode.folders[segment]) {
                currentNode.folders[segment] = { folders: {}, files: {} };
            }
            currentNode = currentNode['folders'][segment];
        }
      }
    }
  
    return repoTree;
}

function processSource(path) {
    let parts = path.split('/');
    return parts.slice(2).join('/');
}

export { processTree, processSource };