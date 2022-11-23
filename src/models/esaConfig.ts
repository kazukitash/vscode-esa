import { WorkspaceConfiguration, window } from "vscode";

export class ESAConfig {
  accessToken?: string;
  userName?: string;
  teamName?: string;

  constructor(config: WorkspaceConfiguration) {
    this.accessToken = config.accessToken;
    this.userName = config.userName;
    this.teamName = config.teamName;
  }

  isValid(): boolean {
    if (!this.accessToken) {
      window.showInformationMessage("Check readme for details.");
      window.showErrorMessage("Please set personal access token.");
      return false;
    }
    if (!this.userName) {
      window.showInformationMessage("Check readme for details.");
      window.showErrorMessage("Please set your user name.");
      return false;
    }
    if (!this.teamName) {
      window.showInformationMessage("Check readme for details.");
      window.showErrorMessage("Please set your team name.");
      return false;
    }
    return true;
  }
}
