import * as vscode from "vscode";

export class ESAConfig {
  accessToken?: string;
  userName?: string;
  teamName?: string;

  constructor(config: vscode.WorkspaceConfiguration) {
    this.accessToken = config.accessToken;
    this.userName = config.userName;
    this.teamName = config.teamName;
  }

  isValid(): boolean {
    if (!this.accessToken) {
      vscode.window.showInformationMessage("Check readme for details.");
      vscode.window.showErrorMessage("Please set personal access token.");
      return false;
    }
    if (!this.userName) {
      vscode.window.showInformationMessage("Check readme for details.");
      vscode.window.showErrorMessage("Please set your user name.");
      return false;
    }
    if (!this.teamName) {
      vscode.window.showInformationMessage("Check readme for details.");
      vscode.window.showErrorMessage("Please set your team name.");
      return false;
    }
    return true;
  }
}
