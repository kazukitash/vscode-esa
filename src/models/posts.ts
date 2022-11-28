import { QuickPickItem } from 'vscode'
import { Post } from './post'
import * as dayjs from 'dayjs'

export class Posts {
  posts: Post[]
  items: QuickPickItem[]

  constructor(posts: Post[]) {
    this.posts = posts
    this.items = posts.map((post) => {
      const updatedAt = dayjs(post.updated_at).format('YYYY/MM/DD HH:mm:ss')
      const userName = post.created_by.name
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
