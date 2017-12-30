# Rails Test Runner README

Run your rails tests smoothly from within Visual Studio Code

## Quickly run your tests
\!\[Commands\]\(images/rails-test-runner-commands.gif\)

## Run them through menues as well
\!\[Context menues\]\(images/rails-test-runner-menu.gif\)

## Project goal
To allow users to easily and quickly run either individual tests
or the whole test suite in a rails project no matter if they use
minitest, rspec or cucumber.

## Features
The extension currently only supports rspec but should eventually
support the most popular test runners.

### Run all tests in the currently opened file
cmd-shift-p `railsTestRunner.runAllTestsInFile`

Or select the option via the context menu

### Run tests on current line
cmd-shift-p `railsTestRunner.runTestAtLine`

Or select the option via the context menu

### Run last test(s)
cmd-shift-p `railsTestRunner.runLastTests`

### Run all tests in current folder
Right click on folder in explorer menu and select `Rails Test Runner: Run all tests in folder`

### Run all tests
cmd-shift-p `railsTestRunner.runAllTests`

### 0.1

Initial release

### Todo
- [x] Support rspec
- [ ] Support minitest
- [ ] Support cucumber
