import * as vscode from "vscode";
const axios = require("axios");

import { Post } from "../models/post";
import { Posts } from "../models/posts";
import { ESAConfig } from "../models/esaConfig";
import { Exception, LOGTYPE } from "../helpers/exception";

export class PostController {
  static esaURL = "https://api.esa.io/v1/teams";

  static async index(esaConfig: ESAConfig, q: string): Promise<Posts> {
    const config = {
      method: "get",
      url: `${this.esaURL}/${esaConfig.teamName}/posts`,
      params: {
        access_token: esaConfig.accessToken,
        q: q,
      },
    };

    let posts = new Array<Post>();
    vscode.window.setStatusBarMessage("Requesting posts ...", 2000);
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
            LOGTYPE.ERROR
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

  static update(esaConfig: ESAConfig, post: Post) {
    const config = {
      method: "patch",
      url: `${this.esaURL}/${esaConfig.teamName}/posts/${post.number}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${esaConfig.accessToken}`,
      },
      data: {
        post: post,
      },
    };

    vscode.window.setStatusBarMessage("Updating posts ...", 2000);
    try {
      axios(config)
        .then((response: any) => {
          vscode.window.showInformationMessage(
            `Update post "${response.data.name}"`
          );
        })
        .catch((error: any) => {
          throw new Exception(
            `Server response status: ${error.status}\nerror: ${error.response.data.error}\nmessage: ${error.response.data.message}`,
            LOGTYPE.ERROR
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
