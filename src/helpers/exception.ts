import * as vscode from "vscode";

export const LOGTYPE = {
  INFO: "info",
  WARN: "warning",
  ERROR: "error",
} as const;

type LogType = typeof LOGTYPE[keyof typeof LOGTYPE];

export class Exception {
  message: string;
  type: LogType;

  constructor(message: string, type: LogType) {
    this.message = message;
    this.type = type;
  }

  log() {
    switch (this.type) {
      case LOGTYPE.INFO:
        vscode.window.showInformationMessage(this.message);
        break;
      case LOGTYPE.WARN:
        vscode.window.showWarningMessage(this.message);
        break;
      case LOGTYPE.ERROR:
      default:
        vscode.window.showErrorMessage(this.message);
        break;
    }
  }
}
