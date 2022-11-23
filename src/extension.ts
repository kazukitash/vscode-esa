import * as vscode from "vscode";
import { PostIndexView } from "./views/post/index";
import { PostUpdateView } from "./views/post/update";
import { configIsValid } from "./helpers/validations";
import { ESAConfig } from "./models/esaConfig";

export function activate(context: vscode.ExtensionContext) {
  console.log('"vscode-esa" is now active!');

  let open = vscode.commands.registerCommand("extension.esa.open", () => {
    const esaConfig = new ESAConfig(vscode.workspace.getConfiguration("esa"));
    if (esaConfig.isValid()) PostIndexView(esaConfig);
  });
  let update = vscode.commands.registerCommand("extension.esa.update", () => {
    const esa = vscode.workspace.getConfiguration("esa");
    if (configIsValid(esa)) PostUpdateView();
  });

  context.subscriptions.push(open);
  context.subscriptions.push(update);
}

export function deactivate() {}
