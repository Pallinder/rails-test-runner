'use strict';

import { ExtensionContext, Terminal, window, commands, Uri } from 'vscode';
import runner from './runner';
import state_handler from './state_handler';
import terminal_handler from './terminal_handler';

const terminalHandler = new terminal_handler();

export function activate(context: ExtensionContext): void {
    const stateHandler = new state_handler(context.workspaceState);
    const extensionRunner = new runner(stateHandler, terminalHandler);

    window.onDidCloseTerminal((terminal: Terminal) => {
        terminalHandler.destroyTerminal(terminal);
    });

    commands.registerCommand('extension.runAllSpecs', () => {
        extensionRunner.runAllSpecs();
    });

    commands.registerCommand('extension.runAllSpecsInFolder', () => {
        console.log('Running all specs in folder');
    });

    commands.registerCommand('extension.runSpec', () => {
        extensionRunner.runSpec();
    });

    commands.registerCommand('extension.runSpecFromLine', () => {
        extensionRunner.runSpecFromLine();
    });

    commands.registerCommand('extension.runLastSpec', () => {
        extensionRunner.runLastSpec();
    });
}

export function deactivate(): void {
    terminalHandler.destroyTerminal();
}
