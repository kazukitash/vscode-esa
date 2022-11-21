import * as vscode from "vscode";

import { PostIndexView } from "./views/post/index";
import { configIsValid } from "./helpers/validations";

export function activate(context: vscode.ExtensionContext) {
  console.log('"vscode-esa" is now active!');

  let open = vscode.commands.registerCommand("esa.open", () => {
    const config = vscode.workspace.getConfiguration("esa");
    if (configIsValid(config)) PostIndexView();
  });

  context.subscriptions.push(open);
}

export function deactivate() {}
