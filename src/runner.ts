import { window, Terminal, Position, Uri } from 'vscode';
import state_handler from './state_handler';
import terminal_handler from './terminal_handler';

export default class Runner {
  command: string;
  stateHandler: state_handler;
  terminalHandler: terminal_handler;
  focusTerminal: boolean;

  constructor(stateHandler: state_handler, terminalHandler: terminal_handler, command: string, focusTerminal: boolean) {
    this.stateHandler = stateHandler;
    this.terminalHandler = terminalHandler;
    this.command = command;
    this.focusTerminal = focusTerminal;
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

  runTests(path: string): void {
    const terminal = this.terminalHandler.retrieveTerminal();
    const commandToRun = `${this.command} ${path}`;

    this.stateHandler.set('lastFile', path);

    terminal.show(!this.focusTerminal);
    terminal.sendText(commandToRun);
  }
}
