import { ExtensionContext, commands, workspace } from "vscode";
import { PostOpen } from "./commands/post/open";
import { PostUpdate } from "./commands/post/update";
import { ESA } from "./models/esa";

export function activate(context: ExtensionContext) {
  console.log('"vscode-esa" is now active!');

  let open = commands.registerCommand("extension.esa.open", () => {
    const esa = new ESA(workspace.getConfiguration("esa"));
    if (esa.isValid()) PostOpen(esa);
  });
  let update = commands.registerCommand("extension.esa.update", () => {
    const esa = new ESA(workspace.getConfiguration("esa"));
    if (esa.isValid()) PostUpdate(esa);
  });

  context.subscriptions.push(open);
  context.subscriptions.push(update);
}

export function deactivate() {}
