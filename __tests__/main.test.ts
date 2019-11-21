import {getIssue} from '../src/issue'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

test('issue number before trigger word', async() => {
    const message = "Last commit. #12 ready for testing.";
    const trigger = "ready for testing";
    expect(getIssue(message, trigger)).toBe(12);
});

test('issue number after trigger word', async() => {
    const message = "Last commit. Ready for testing #12.";
    const trigger = "Ready for testing";
    expect(getIssue(message, trigger)).toBe(12);
});

test('issue number after trigger word with :', async() => {
    const message = "Last commit. Ready for testing: #12";
    const trigger = "Ready for testing";
    expect(getIssue(message, trigger)).toBe(12);
});

test('issue number trigger not exactly equal', async() => {
    const message = "Last commit. #12 ready for testing.";
    const trigger = "Ready for testing";
    expect(getIssue(message, trigger)).toBe(12);
});

test('issue number trigger camel case', async() => {
    const message = "Last commit. #12 ready for testing.";
    const trigger = "ReadyForTesting";
    expect(getIssue(message, trigger)).toBe(12);
});

test('issue number trigger kebab case', async() => {
    const message = "Last commit. #12 ready for testing.";
    const trigger = "ready-for-testing";
    expect(getIssue(message, trigger)).toBe(12);
});

test('issue number trigger snake case', async() => {
    const message = "Last commit. #12 ready for testing.";
    const trigger = "ready_for_testing";
    expect(getIssue(message, trigger)).toBe(12);
});

test('trigger not found', async() => {
    const message = "Last commit.";
    const trigger = "ready for testing";
    expect(getIssue(message, trigger)).toBe(-1);
});

test('issue number not found', async() => {
    const message = "Last commit. Ready for testing.";
    const trigger = "ready for testing";
    expect(() => {getIssue(message, trigger)}).toThrowError("Found the trigger word but no issue number is provided.")
})