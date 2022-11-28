import { ExtensionContext, commands } from 'vscode'
import { PostCommand } from './commands/post'

export function activate(context: ExtensionContext): void {
  console.log('"vscode-esa" is now active!')

  const create = commands.registerCommand('extension.esa.create', async () => {
    await PostCommand.instance()?.create()
  })
  const open = commands.registerCommand('extension.esa.open', async () => {
    await PostCommand.instance()?.open()
  })
  const update = commands.registerCommand('extension.esa.update', () => {
    PostCommand.instance()?.update()
  })

  context.subscriptions.push(create)
  context.subscriptions.push(open)
  context.subscriptions.push(update)
}
