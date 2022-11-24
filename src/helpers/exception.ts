import { window } from 'vscode'

export const LOG_TYPE = {
  INFO: 'info',
  WARN: 'warning',
  ERROR: 'error',
} as const

type LogType = typeof LOG_TYPE[keyof typeof LOG_TYPE]

export class Exception extends Error {
  message: string
  type: LogType

  constructor(message: string, type: LogType) {
    super(message)
    this.name = new.target.name
    this.message = message
    this.type = type
  }

  log(): void {
    switch (this.type) {
      case LOG_TYPE.INFO:
        void window.showInformationMessage(this.message)
        break
      case LOG_TYPE.WARN:
        void window.showWarningMessage(this.message)
        break
      case LOG_TYPE.ERROR:
      default:
        void window.showErrorMessage(this.message)
        break
    }
  }
}
