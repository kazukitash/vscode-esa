import * as vscode from "vscode";
import { PostIndexView } from "./views/post/index";
import { PostUpdateView } from "./views/post/update";
import { configIsValid } from "./helpers/validations";

export function activate(context: vscode.ExtensionContext) {
  console.log('"vscode-esa" is now active!');

  let open = vscode.commands.registerCommand("extension.esa.open", () => {
    const esa = vscode.workspace.getConfiguration("esa");
    if (configIsValid(esa)) PostIndexView();
  });
  let update = vscode.commands.registerCommand("extension.esa.update", () => {
    const esa = vscode.workspace.getConfiguration("esa");
    if (configIsValid(esa)) PostUpdateView();
  });

  context.subscriptions.push(open);
  context.subscriptions.push(update);
}

export function deactivate() {}
