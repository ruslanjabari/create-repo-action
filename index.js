const core = require("@actions/core");
const github = require("@actions/github");
const axios = require("axios");

async function run() {
  try {
    // Retrieve the GitHub token input
    const ghToken = core.getInput("org-admin-token");

    // Get the repository name from the issue title
    const targetRepoName = github.context.payload.issue.title;

    // Get the organization/owner name from the context
    const targetOrgName = github.context.repo.owner;

    // Prepare the data for the repository creation
    const createRepoData = JSON.stringify({
      name: targetRepoName,
      private: true,
      visibility: "private",
    });

    // Prepare the configuration for the API request
    const config = {
      method: "post",
      url: `https://api.github.com/orgs/${targetOrgName}/repos`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${ghToken}`,
        "Content-Type": "application/json",
      },
      data: createRepoData,
    };

    // Send the request to create the repository
    const response = await axios(config);
    console.log(`Repo ${targetRepoName} created successfully!`);
    core.setOutput(
      "repo-url",
      `https://github.com/${targetOrgName}/${targetRepoName}`
    );
  } catch (error) {
    core.setOutput("repo-url", "");
    core.setFailed(error.message);
  }
}

run();
