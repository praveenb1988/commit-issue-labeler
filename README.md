# Commit Issue Labeler

This action allows you to add a label on a push event. For this you can specify
a trigger word you want to use in the commit message and the label you want to
add to the issue.

## Usage

Create a new label or use one of the default you want to add to the issues with
the trigger word.

Create a new workflow `.yml` file in the `.github/workflows/` folder. In this new created file you have to specify the trigger word as well as the name of the label.

### testing-label-on-commit.yml
```yml
name: Add testing label on issue

on: push

jobs:
  add-testing-label:
    runs-on: ubuntu-latest
    steps:
      - uses: korti11/commit-issue-labeler@v0.1
        with:
          label: testing
          trigger: ready for testing
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

### Options

#### label
The label can be what ever label exists in the repository.

#### trigger
The trigger word can be only one word or multiples. It also supports camel case,
kebab case and snake case. So feel free to use what ever you prefer.<br>
##### Example commit messages
`Last commit. #12 ready for testing.`<br>
`Last commit. Ready for testing #12.`<br>
`Last commit. Ready for testing: #12.`<br>
`Last commit. Ready_for_testing #12`<br>