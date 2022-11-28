import { PostData } from './postData'

export class CreatePost implements Pick<PostData, 'name' | 'category'> {
  constructor(public readonly name: string, public readonly category: string) {}

  static instance(path: string): CreatePost {
    let category = ''
    let name = ''
    if (path.includes('/')) {
      const PATTERN = /(^.*)\/(.+$)/
      const match = PATTERN.exec(path)
      if (match !== null) {
        category = match[1]
        name = match[2]
      }
    } else {
      name = path
    }
    return new CreatePost(name, category)
  }
}
