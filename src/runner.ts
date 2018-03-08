import { window, Terminal, Position, Uri, WorkspaceConfiguration, commands } from 'vscode';
import state_handler from './state_handler';
import terminal_handler from './terminal_handler';

export default class Runner {
  config: WorkspaceConfiguration;
  stateHandler: state_handler;
  terminalHandler: terminal_handler;

  constructor(stateHandler: state_handler, terminalHandler: terminal_handler, config: WorkspaceConfiguration) {
    this.stateHandler = stateHandler;
    this.terminalHandler = terminalHandler;
    this.config = config;
  }
  runAllTests(): void {
    this.runTests('');
  }

  runAllTestsInFolder(fileUri: Uri): void {
    this.runTests(fileUri.fsPath);
  }

  runAllTestsInFile(): void {
    const fileName = this.retrieveFileName();
    this.runTests(fileName);
  }

  runLastTests(): void {
    if (this.stateHandler.get('lastFile')) {
      this.runTests(this.stateHandler.get('lastFile'));
    } else {
      window.showInformationMessage(
        'Couldnt run the last spec again since no spec has been run.',
      );
    }
  }

  runLastFailedTests(): void {
    const fileName = this.retrieveFileName();
    this.runTests('', '--only-failures');
  }

  runTestAtLine(): void {
    const fileName = this.retrieveFileName(true);
    this.runTests(fileName);
  }

  retrieveFileName(retrieveLineNumber?: boolean): string {
    if (!window.activeTextEditor) {
      return;
    }

    const editor = window.activeTextEditor;
    let fileName = editor.document.fileName;
    const currentPosition: Position = window.activeTextEditor.selection.active;
    const lineNumber = retrieveLineNumber ? currentPosition.line + 1 : 0;

    if (fileName.indexOf('_spec.rb') === -1) {
      window.showInformationMessage(
        'File does not appear to be a spec file (missing _spec in the filename?)',
      );
      return;
    }
    if (lineNumber !== 0) {
      fileName = `${fileName}:${lineNumber}`;
    }
    return fileName;
  }

  runTests(path: string, commandLineArguments:string = ''): void {
    let commandToRun = '';

    if (this.shouldFailFast()) {
      commandToRun = `${this.command()} ${commandLineArguments} --fail-fast --order ${path}`;
    } else {
      commandToRun = `${this.command()} ${commandLineArguments} ${path}`;
    }
    const terminal = this.terminalHandler.retrieveTerminal();

    this.stateHandler.set('lastFile', path);

    terminal.show(!this.shouldFocusTerminal());
    if (this.shouldClearTerminal()) {
      this.terminalHandler.clearTerminal();
    }
    terminal.sendText(commandToRun);
  }

  command(): string {
    return this.config.get<string>('rspecCommand');
  }

  shouldFailFast(): boolean {
    return this.config.get<boolean>('rspec.failFast');
  }

  shouldFocusTerminal(): boolean {
    return this.config.get<boolean>('focusTerminal');
  }

  shouldClearTerminal(): boolean {
    return this.config.get<boolean>('clearTerminal');
  }
}
