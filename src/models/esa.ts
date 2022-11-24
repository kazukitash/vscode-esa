import { WorkspaceConfiguration, window } from 'vscode'

export class ESA {
  accessToken: string
  userName: string
  teamName: string

  constructor(config: WorkspaceConfiguration) {
    this.accessToken =
      config.accessToken !== undefined ? config.accessToken : ''
    this.userName = config.userName !== undefined ? config.userName : ''
    this.teamName = config.teamName !== undefined ? config.teamName : ''
  }

  isValid(): boolean {
    if (this.accessToken === '') {
      void window.showInformationMessage('Check readme for details.')
      void window.showErrorMessage('Please set personal access token.')
      return false
    }
    if (this.userName === '') {
      void window.showInformationMessage('Check readme for details.')
      void window.showErrorMessage('Please set your user name.')
      return false
    }
    if (this.teamName === '') {
      void window.showInformationMessage('Check readme for details.')
      void window.showErrorMessage('Please set your team name.')
      return false
    }
    return true
  }
}
