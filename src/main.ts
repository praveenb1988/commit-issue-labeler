import * as core from '@actions/core';
import * as github from '@actions/github';
import Octokit from '@octokit/rest';
import {getIssue} from './issue';

async function run() {
  if(!process.env.GITHUB_REPOSITORY) {
    core.setFailed('GITHUB_REPOSITORY missing, must be set to "<repo owner>/<repo name>');
    return;
  }

  try {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/")
    const {label, trigger} = getValidInput();
    const {eventName, payload} = github.context;
    const commitMessages = payload.commits;

    validateEvent(eventName);
    var issue;
    for(var commitMessage in commitMessages) {
      issue = getIssue(commitMessage, trigger);
      if(issue != -1) break;
    }

    if(issue == -1) return;

    const octokit = new Octokit();

    if(payload.repository != null) {
      await octokit.issues.addLabels({
        owner: owner,
        repo: repo,
        issue_number: issue,
        labels: [label]
      } as Octokit.IssuesAddLabelsParams);
    }
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
