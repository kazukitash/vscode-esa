import * as vscode from "vscode";

export function configIsValid(config: vscode.WorkspaceConfiguration): boolean {
  if (!config.accessToken) {
    vscode.window.showInformationMessage("Check readme for details.");
    vscode.window.showErrorMessage("Please set personal access token.");
    return false;
  }
  if (!config.userName) {
    vscode.window.showInformationMessage("Check readme for details.");
    vscode.window.showErrorMessage("Please set your user name.");
    return false;
  }
  if (!config.teamName) {
    vscode.window.showInformationMessage("Check readme for details.");
    vscode.window.showErrorMessage("Please set your team name.");
  }
  return true;
}
