import * as core from '@actions/core';
import * as github from '@actions/github';
import {IssuesAddLabelsParams} from '@octokit/rest';
import {getIssue} from './issue';

async function run() {
  if(!process.env.GITHUB_REPOSITORY) {
    core.setFailed('GITHUB_REPOSITORY missing, must be set to "<repo owner>/<repo name>');
    return;
  }
  if(!process.env.GITHUB_TOKEN) {
    core.setFailed('GITHUB_TOKEN missing, must be set with ${{secrets.GITHUB_TOKEN}}');
    return;
  }

  try {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/")
    const {label, trigger} = getValidInput();
    const {eventName, payload} = github.context;
    const commitMessages = payload.commits;

    validateEvent(eventName);
    var issue;
    for(var commitMessage of commitMessages) {
      issue = getIssue(commitMessage.message, trigger);
      if(issue != -1) break;
    }

    if(issue == -1) {
      console.info("No issue found.")
      return;
    }

    console.info(`Added the label ${label} to the issue #${issue}`);

    const octokit = new github.GitHub(process.env.GITHUB_TOKEN);

    await octokit.issues.addLabels({
      owner: owner,
      repo: repo,
      issue_number: issue,
      labels: [label]
    } as IssuesAddLabelsParams);
  } catch (error) {
    core.setFailed(error.message);
  }
}

function validateEvent(eventName: string) {
  if(eventName != "push") {
    throw new Error(`Only the push event is allowed, used event: ${eventName}`)
  }
}

function getValidInput() {
  const label = core.getInput('label');
  const trigger = core.getInput('trigger');

  if(!label || !trigger) {
    throw new Error('No label or trigger present.');
  }
  return {
    label: label,
    trigger: trigger
  }
}



run();
