import { Memento } from 'vscode';

export default class StateHandler {
  context: Memento;

  constructor(context: Memento) {
    this.context = context;
  }

  set(key: string, value: any): void {
    this.context[key] = value;
  }

  get(key: string): any {
    return(this.context[key]);
  }
}

