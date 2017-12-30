import * as vscode from 'vscode';

export default class TerminalHandler {
  terminal: vscode.Terminal;

  constructor() {
    this.terminal = this.createTerminal();
  }

  retrieveTerminal(): vscode.Terminal {
    if (!this.terminal) {
      this.terminal = this.createTerminal();
    }

    return this.terminal;
  }

  destroyTerminal(terminal?: vscode.Terminal): void {
    if (terminal) {
      if (terminal === this.terminal) {
        this.terminal = null;
      }
    } else {
      this.terminal = null;
    }
  }

  createTerminal(): vscode.Terminal {
    return(vscode.window.createTerminal(
      'Spec runner',
    ));
  }
}

