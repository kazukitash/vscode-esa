import * as vscode from "vscode";

import { PostIndexView } from "./views/post/index";
import { PostUpdateView } from "./views/post/update";
import { configIsValid } from "./helpers/validations";

export function activate(context: vscode.ExtensionContext) {
  console.log('"vscode-esa" is now active!');

  let open = vscode.commands.registerCommand("esa.open", () => {
    const config = vscode.workspace.getConfiguration("esa");
    if (configIsValid(config)) PostIndexView();
  });
  let update = vscode.commands.registerCommand("esa.update", () => {
    const esa = vscode.workspace.getConfiguration("esa");
    if (configIsValid(esa)) PostUpdateView();
  });

  context.subscriptions.push(open);
  context.subscriptions.push(update);
}

export function deactivate() {}
