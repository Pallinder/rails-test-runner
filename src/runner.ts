import { window, Terminal, Position, Uri } from 'vscode';
import state_handler from './state_handler';
import terminal_handler from './terminal_handler';

export default class Runner {
  stateHandler: state_handler;
  terminalHandler: terminal_handler;

  constructor(stateHandler: state_handler, terminalHandler: terminal_handler) {
    this.stateHandler = stateHandler;
    this.terminalHandler = terminalHandler;
  }
  runAllSpecs(): void {
    this.runCommand('./specs');
  }

  runAllSpecsInFolder(fileURI: Uri): void {
    console.log('Got uri', fileURI);
  }

  runSpec(): void {
    const fileName = this.retrieveFileName();
    this.runCommand(fileName);
  }

  runLastSpec(): void {
    if (this.stateHandler.get('lastFile')) {
      this.runCommand(this.stateHandler.get('lastFile'));
    } else {
      window.showInformationMessage(
        'Couldnt run the last spec again since no spec has been run.',
      );
    }
  }

  runSpecFromLine(): void {
    const fileName = this.retrieveFileName(true);
    this.runCommand(fileName);
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

  runCommand(fileName: string): void {
    const terminal = this.terminalHandler.retrieveTerminal();
    const command = `bundle exec rspec ${fileName}`;

    this.stateHandler.set('lastFile', fileName);

    terminal.show();
    terminal.sendText(command);
  }
}
