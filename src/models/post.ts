import * as dayjs from 'dayjs'
import { Exception, LOG_TYPE } from '../helpers/exception'
import { PostData } from './postData'
import { User } from './User'

export class Post {
  number: number
  name: string
  bodyMd: string
  wip: boolean
  createdBy?: User
  updatedAt?: dayjs.Dayjs

  constructor(post: {
    number: number
    name: string
    bodyMd: string
    wip: boolean
    createdBy?: User
    updatedAt?: string
  }) {
    this.number = post.number
    this.name = post.name
    this.bodyMd = post.bodyMd
    this.wip = post.wip
    this.createdBy = post.createdBy
    this.updatedAt = dayjs(post.updatedAt)
  }

  static decode(post: PostData): Post | undefined {
    const number = post.number
    const name = post.name
    const bodyMd = post.body_md
    const wip = post.wip
    const createdBy = post.created_by
    const updatedAt = post.updated_at
    if (
      number === undefined ||
      name === undefined ||
      bodyMd === undefined ||
      wip === undefined ||
      createdBy === undefined ||
      updatedAt === undefined
    ) {
      return undefined
    } else {
      return new Post({ number, name, bodyMd, wip, createdBy, updatedAt })
    }
  }

  static cast(content: string): Post {
    const PATTERN = /^\s*---\s*\n((?:\s*[^\s:]+\s*:[^\n]*\n)+)---\s*\n/g

    const match = PATTERN.exec(content)
    if (match === null) {
      throw new Exception(
        'No metadata found. Contents should include metadata.',
        LOG_TYPE.ERROR
      )
    }

    const bodyMd = content.substring(match[0].trim().length).replace(/^\s+/, '')
    let number: number | undefined
    let name: string | undefined
    let wip: boolean | undefined
    match[1]
      .trim()
      .split('\n')
      .forEach((meta) => {
        const entry = meta.split(':')
        const key = entry[0].trim()
        const value = entry[1].trim()
        if (key === 'number') {
          number = Number(value)
        } else if (key === 'name') {
          name = value
        } else if (key === 'wip') {
          wip = Boolean(value)
        }
      })

    if (number === undefined) {
      throw new Exception(
        'metadata(number:) is not found. Number should be include in metadata.',
        LOG_TYPE.ERROR
      )
    }

    if (name === undefined) {
      throw new Exception(
        'metadata(name:) is not found. Name should be included in metadata.',
        LOG_TYPE.ERROR
      )
    }

    if (wip === undefined) {
      wip = true
    }

    return new Post({ number, name, bodyMd, wip })
  }

  generateContent(): string {
    return `---
name: ${this.name}
number: ${this.number}
wip: ${String(this.wip)}
---

${this.bodyMd}
`
  }
}
