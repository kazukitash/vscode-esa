import { ExtensionContext, commands } from "vscode";
import { PostCommand } from "./commands/post";

export function activate(context: ExtensionContext) {
  console.log('"vscode-esa" is now active!');

  let open = commands.registerCommand("extension.esa.open", () => {
    PostCommand.instance()?.open();
  });
  let update = commands.registerCommand("extension.esa.update", () => {
    PostCommand.instance()?.update();
  });

  context.subscriptions.push(open);
  context.subscriptions.push(update);
}

export function deactivate() {}
