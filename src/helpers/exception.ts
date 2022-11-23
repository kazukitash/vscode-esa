import { window } from "vscode";

export const LOG_TYPE = {
  INFO: "info",
  WARN: "warning",
  ERROR: "error",
} as const;

type LogType = typeof LOG_TYPE[keyof typeof LOG_TYPE];

export class Exception {
  message: string;
  type: LogType;

  constructor(message: string, type: LogType) {
    this.message = message;
    this.type = type;
  }

  log() {
    switch (this.type) {
      case LOG_TYPE.INFO:
        window.showInformationMessage(this.message);
        break;
      case LOG_TYPE.WARN:
        window.showWarningMessage(this.message);
        break;
      case LOG_TYPE.ERROR:
      default:
        window.showErrorMessage(this.message);
        break;
    }
  }
}
