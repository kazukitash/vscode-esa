import { PostData } from './postData'
import { User } from './User'

export class Post implements PostData {
  constructor(
    public number: number,
    public name: string,
    public body_md: string,
    public wip: boolean,
    public category: string,
    public created_by: User,
    public updated_at: string
  ) {}

  static instance(postData: PostData): Post {
    return new Post(
      postData.number,
      postData.name,
      postData.body_md,
      postData.wip,
      postData.category,
      postData.created_by,
      postData.updated_at
    )
  }

  generateContent(): string {
    return `---
name: ${this.name}
number: ${this.number}
wip: ${String(this.wip)}
---

${this.body_md}
`
  }
}
