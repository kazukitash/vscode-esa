import { ExtensionContext, commands, workspace } from "vscode";
import { PostIndexView } from "./views/post/index";
import { PostUpdateView } from "./views/post/update";
import { ESAConfig } from "./models/esaConfig";

export function activate(context: ExtensionContext) {
  console.log('"vscode-esa" is now active!');

  let open = commands.registerCommand("extension.esa.open", () => {
    const esaConfig = new ESAConfig(workspace.getConfiguration("esa"));
    if (esaConfig.isValid()) PostIndexView(esaConfig);
  });
  let update = commands.registerCommand("extension.esa.update", () => {
    const esaConfig = new ESAConfig(workspace.getConfiguration("esa"));
    if (esaConfig.isValid()) PostUpdateView(esaConfig);
  });

  context.subscriptions.push(open);
  context.subscriptions.push(update);
}

export function deactivate() {}
