"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const rest_1 = __importDefault(require("@octokit/rest"));
const issue_1 = require("./issue");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.GITHUB_REPOSITORY) {
            core.setFailed('GITHUB_REPOSITORY missing, must be set to "<repo owner>/<repo name>');
            return;
        }
        try {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
            const { label, trigger } = getValidInput();
            const { eventName, payload } = github.context;
            const commitMessages = payload.commits;
            validateEvent(eventName);
            var issue;
            for (var commitMessage of commitMessages) {
                console.debug(commitMessage);
                issue = issue_1.getIssue(commitMessage, trigger);
                if (issue != -1)
                    break;
            }
            if (issue == -1) {
                console.info("No issue found.");
                return;
            }
            console.info(`Added the label ${label} to the issue #${issue}`);
            const octokit = new rest_1.default();
            yield octokit.issues.addLabels({
                owner: owner,
                repo: repo,
                issue_number: issue,
                labels: [label]
            });
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
function validateEvent(eventName) {
    if (eventName != "push") {
        throw new Error(`Only the push event is allowed, used event: ${eventName}`);
    }
}
function getValidInput() {
    const label = core.getInput('label');
    const trigger = core.getInput('trigger');
    if (!label || !trigger) {
        throw new Error('No label or trigger present.');
    }
    return {
        label: label,
        trigger: trigger
    };
}
run();
