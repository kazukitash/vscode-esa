import { QuickPickItem } from 'vscode'
import { Post } from './post'

export class Posts {
  posts: Post[]
  items: QuickPickItem[]

  constructor(posts: Post[]) {
    this.posts = posts
    this.items = posts.map((post) => {
      const updatedAt = post.updatedAt?.format('YYYY/MM/DD HH:mm:ss')
      const userName = post.createdBy?.name
      if (updatedAt === undefined || userName === undefined) {
        return {
          label: post.number.toString(),
          description: post.name,
        }
      } else {
        return {
          label: post.number.toString(),
          description: post.name,
          detail: `${updatedAt} ${userName}`,
        }
      }
    })
  }

  empty(): boolean {
    return this.posts.length === 0
  }

  find(item: QuickPickItem): Post | undefined {
    return this.posts.find((p) => p.number.toString() === item.label)
  }
}
