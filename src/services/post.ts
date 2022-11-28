import { window } from 'vscode'
import { Post } from '../models/post'
import { PostData } from '../models/postData'
import { Posts } from '../models/posts'
import { ESA } from '../models/esa'
import { Exception, LOG_TYPE } from '../helpers/exception'
import { AxiosError, AxiosResponse } from 'axios'
import { CreatePost } from '../models/createPost'
import { UpdatePost } from '../models/updatePost'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios')

const OPEN_OPTION = {
  OWN: 'Open from my posts',
  LATEST: 'Open from latest posts',
} as const

export const OPEN_OPTIONS = Object.values(OPEN_OPTION)

export class PostService {
  static esaURL = 'https://api.esa.io/v1/teams'
  esa: ESA

  constructor(esa: ESA) {
    this.esa = esa
  }

  async create(post: CreatePost): Promise<Post | undefined> {
    const config = {
      method: 'post',
      url: `${PostService.esaURL}/${this.esa.teamName}/posts`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.esa.accessToken}`,
      },
      data: { post },
    }

    let newPost: Post | undefined
    window.setStatusBarMessage('Creating post ...', 2000)
    try {
      await axios(config)
        .then((response: AxiosResponse) => {
          if (response.headers?.['content-type']?.includes('json') ?? false) {
            newPost = Post.instance(response.data as PostData)
          }
        })
        .catch((error: AxiosError) => {
          const status = error.status
          const response = error.response?.data
          if (status !== undefined) {
            throw new Exception(
              `API Request Error\nStatus: ${status}\nResponse: ${JSON.stringify(
                response
              )}`,
              LOG_TYPE.ERROR
            )
          }
        })
    } catch (error) {
      if (error instanceof Exception) {
        error.log()
      } else {
        console.log(error)
      }
    }
    return newPost
  }

  async open(option: string): Promise<Posts> {
    const config = {
      method: 'get',
      url: `${PostService.esaURL}/${this.esa.teamName}/posts`,
      params: {
        access_token: this.esa.accessToken,
        q: option === OPEN_OPTION.OWN ? `@${this.esa.userName}` : '',
      },
    }

    const posts = new Array<Post>()
    window.setStatusBarMessage('Requesting posts ...', 2000)
    try {
      await axios(config)
        .then((response: AxiosResponse) => {
          if (response.headers?.['content-type']?.includes('json') ?? false) {
            response.data.posts.forEach((postData: PostData) => {
              const post = Post.instance(postData)
              if (post !== undefined) posts.push(post)
            })
          }
        })
        .catch((error: AxiosError) => {
          const status = error.status
          const response = error.response?.data
          if (status !== undefined) {
            throw new Exception(
              `API Request Error\nStatus: ${status}\nResponse: ${JSON.stringify(
                response
              )}`,
              LOG_TYPE.ERROR
            )
          }
        })
    } catch (error) {
      if (error instanceof Exception) {
        error.log()
      } else {
        console.log(error)
      }
    }
    return new Posts(posts)
  }

  update(post: UpdatePost): void {
    const config = {
      method: 'patch',
      url: `${PostService.esaURL}/${this.esa.teamName}/posts/${post.number}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.esa.accessToken}`,
      },
      data: { post },
    }

    window.setStatusBarMessage('Updating post ...', 2000)
    try {
      axios(config)
        .then((response: AxiosResponse) => {
          const name: string = response.data.name
          void window.showInformationMessage(`Update post "${name}"`)
        })
        .catch((error: AxiosError) => {
          const status = error.status
          const response = JSON.stringify(error.response?.data)
          if (status !== undefined) {
            throw new Exception(
              `API Request Error\nStatus: ${status}\nResponse: ${response}`,
              LOG_TYPE.ERROR
            )
          }
        })
    } catch (error) {
      if (error instanceof Exception) {
        error.log()
      } else {
        console.log(error)
      }
    }
  }
}
