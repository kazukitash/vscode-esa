import { window, workspace, Position } from 'vscode'
import { PostService, OPEN_OPTIONS } from '../services/post'
import { ESA } from '../models/esa'
import { Exception, LOG_TYPE } from '../helpers/exception'
import { CreatePost } from '../models/createPost'
import { UpdatePost } from '../models/updatePost'

export class PostCommand {
  esa: ESA

  constructor(esa: ESA) {
    this.esa = esa
  }

  static instance(): PostCommand | undefined {
    const esa = new ESA(workspace.getConfiguration('esa'))
    if (esa.isValid()) {
      return new PostCommand(esa)
    } else {
      return undefined
    }
  }

  async create(): Promise<void> {
    if (this.esa.defaultCategory === '') {
      void window.showInformationMessage(
        'You can set default category in settings.'
      )
    }
    try {
      await window
        .showInputBox({
          value: this.esa.defaultCategory,
          prompt:
            'Please enter article path like "category1/category2/articlename"',
        })
        .then(async (rawPath) => {
          const path = rawPath?.trim()
          if (path === undefined || path.length === 0) {
            throw new Exception('Invalid article path', LOG_TYPE.ERROR)
          }
          const post = CreatePost.instance(path)
          const postService = new PostService(this.esa)
          return await postService.create(post)
        })
        .then((post) => {
          if (post === undefined) {
            throw new Exception('Invalid post.', LOG_TYPE.ERROR)
          }
          return post.generateContent()
        })
        .then(async (content) => {
          await workspace
            .openTextDocument({ language: 'markdown' })
            .then((doc) => window.showTextDocument(doc))
            .then(async (editor) => {
              const startPos = new Position(1, 0)
              await editor.edit((edit) => {
                edit.insert(startPos, content)
              })
            })
        })
    } catch (error) {}
  }

  async open(): Promise<void> {
    try {
      await window
        .showQuickPick(OPEN_OPTIONS)
        .then(async (option) => {
          if (option === undefined) {
            throw new Exception('No option selected.', LOG_TYPE.INFO)
          }
          const postService = new PostService(this.esa)
          return await postService.open(option)
        })
        .then(async (posts) => {
          if (posts.empty()) {
            throw new Exception('No posts found.', LOG_TYPE.INFO)
          }
          return await window.showQuickPick(posts.items).then((item) => {
            if (item === undefined) {
              throw new Exception('No post selected.', LOG_TYPE.INFO)
            }
            return posts.find(item)
          })
        })
        .then((post) => {
          if (post === undefined) {
            throw new Exception('Invalid post selected.', LOG_TYPE.ERROR)
          }
          return post.generateContent()
        })
        .then(async (content) => {
          await workspace
            .openTextDocument({ language: 'markdown' })
            .then((doc) => window.showTextDocument(doc))
            .then(async (editor) => {
              const startPos = new Position(1, 0)
              await editor.edit((edit) => {
                edit.insert(startPos, content)
              })
            })
        })
    } catch (error) {
      if (error instanceof Exception) {
        error.log()
      } else {
        console.log(error)
      }
    }
  }

  update(): void {
    try {
      const textEditor = window.activeTextEditor
      if (
        textEditor === undefined ||
        textEditor.document.languageId !== 'markdown'
      ) {
        throw new Exception(
          'Markdown file is not open. Please open and focus the markdown file you want to update.',
          LOG_TYPE.ERROR
        )
      }

      const content = textEditor.document.getText()
      if (content.trim().length === 0) {
        throw new Exception(
          'No contents. Please open and focus the file with contents.',
          LOG_TYPE.ERROR
        )
      }

      const post = UpdatePost.instance(content)
      const postService = new PostService(this.esa)
      postService.update(post)
    } catch (error) {
      if (error instanceof Exception) {
        error.log()
      } else {
        console.log(error)
      }
    }
  }
}
