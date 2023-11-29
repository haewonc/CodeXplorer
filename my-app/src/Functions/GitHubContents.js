import axios from 'axios';

async function fetchGitHubRepoContents(owner, repo, branch) {
  try {
    console.log('here');
    // Get the Git Tree for the specified branch (recursive)
    const treeResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);

    // Process the Git Tree data
    const treeData = treeResponse.data.tree;

    // Extract file names
    const files = [];

    treeData.forEach((item) => {
      if (item.type === 'blob') {
        files.push(item.path);
      }
    });

    // Fetch the contents of each file
    const fileContents = new Map();
    for (const file of files) {
      const content = await fetchFileContent(owner, repo, file, branch);
      fileContents.set(file, content);
    }

    return {
      files,
      fileContents,
    };
  } catch (error) {
    console.error('Error fetching GitHub repository contents:', error);
    throw error;
  }
}

async function fetchFileContent(owner, repo, path, branch = 'main') {
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const response = await axios.get(apiUrl);
    const content = response.data.content ? atob(response.data.content) : '';
    return content;
  } catch (error) {
    console.error('Error fetching file content:', error);
    throw error;
  }
}

export { fetchGitHubRepoContents };