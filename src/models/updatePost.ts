import { Exception, LOG_TYPE } from '../helpers/exception'
import { PostData } from './postData'

export class UpdatePost
  implements Pick<PostData, 'number' | 'name' | 'body_md' | 'wip'>
{
  constructor(
    public number: number,
    public name: string,
    public body_md: string,
    public wip: boolean
  ) {}

  static instance(content: string): UpdatePost {
    const PATTERN = /^\s*---\s*\n((?:\s*[^\s:]+\s*:[^\n]*\n)+)---\s*\n/

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

    return new UpdatePost(number, name, bodyMd, wip)
  }
}
