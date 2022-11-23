import { window } from "vscode";
const axios = require("axios");
import { Post } from "../models/post";
import { Posts } from "../models/posts";
import { ESA } from "../models/esa";
import { Exception, LOG_TYPE } from "../helpers/exception";

const OPEN_OPTION = {
  OWN: "Open from my posts",
  LATEST: "Open from latest posts",
} as const;

export const OPEN_OPTIONS = Object.values(OPEN_OPTION);

export class PostService {
  static esaURL = "https://api.esa.io/v1/teams";
  esa: ESA;

  constructor(esa: ESA) {
    this.esa = esa;
  }

  async open(option: string): Promise<Posts> {
    const config = {
      method: "get",
      url: `${PostService.esaURL}/${this.esa.teamName}/posts`,
      params: {
        access_token: this.esa.accessToken,
        q: option === OPEN_OPTION.OWN ? `@${this.esa.userName}` : "",
      },
    };

    let posts = new Array<Post>();
    window.setStatusBarMessage("Requesting posts ...", 2000);
    try {
      await axios(config)
        .then((response: any) => {
          if (response.headers["content-type"].includes("json")) {
            response.data.posts.forEach((postData: any) => {
              const post = Post.decode(postData);
              if (post) posts.push(post);
            });
          }
        })
        .catch((error: any) => {
          throw new Exception(
            `Server response status: ${error.status}\nerror: ${error.response.data.error}\nmessage: ${error.response.data.message}`,
            LOG_TYPE.ERROR
          );
        });
    } catch (error) {
      if (error instanceof Exception) {
        error.log();
      } else {
        console.log(error);
      }
    }
    return new Posts(posts);
  }

  update(post: Post) {
    const config = {
      method: "patch",
      url: `${PostService.esaURL}/${this.esa.teamName}/posts/${post.number}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.esa.accessToken}`,
      },
      data: {
        post: post,
      },
    };

    window.setStatusBarMessage("Updating posts ...", 2000);
    try {
      axios(config)
        .then((response: any) => {
          window.showInformationMessage(`Update post "${response.data.name}"`);
        })
        .catch((error: any) => {
          throw new Exception(
            `Server response status: ${error.status}\nerror: ${error.response.data.error}\nmessage: ${error.response.data.message}`,
            LOG_TYPE.ERROR
          );
        });
    } catch (error) {
      if (error instanceof Exception) {
        error.log();
      } else {
        console.log(error);
      }
    }
  }
}
