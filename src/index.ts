import * as vscode from 'vscode'
import { turnToCode } from './core';

export function activate(context: vscode.ExtensionContext) {

  const disposable = vscode.commands.registerCommand(
    'extention.turoToObj',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const { document, selection } = editor;
        const text = document.getText(selection);
        try {
        const newText = await turnToCode(text);
        editor.edit((editBuilder) => {
          editBuilder.insert(selection.end, `\n${newText}`);
        });
        } catch(e: any) {
          vscode.window.showErrorMessage(e);
        }
      }
    },
  )
  context.subscriptions.push(disposable)
}

export function deactivate() {}