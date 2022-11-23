import * as vscode from "vscode";
const axios = require("axios");

import { Post } from "../models/post";
import { Posts } from "../models/posts";
import { ESAConfig } from "../models/esaConfig";
import { Exception, LOGTYPE } from "../helpers/exception";

export class PostController {
  static esaURL = "https://api.esa.io/v1/teams";

  static async index(esaConfig: ESAConfig, query: string): Promise<Posts> {
    const config = {
      method: "get",
      url: `${this.esaURL}/${esaConfig.teamName}/posts`,
      params: {
        access_token: esaConfig.accessToken,
        q: query,
      },
    };

    let posts = new Array<Post>();
    try {
      vscode.window.setStatusBarMessage("Requesting posts ...", 2000);
      const response = await axios(config).catch((error: any) => {
        throw new Exception(
          `Server response status: ${error.status}\nerror: ${error.response.data.error}\nmessage: ${error.response.data.message}`,
          LOGTYPE.ERROR
        );
      });

      if (response.headers["content-type"].includes("json")) {
        response.data.posts.forEach((postData: any) => {
          const post = Post.decode(postData);
          if (post) posts.push(post);
        });
      }
    } catch (error) {
      if (error instanceof Exception) {
        error.log();
      } else {
        console.log(error);
      }
    }
    return new Posts(posts);
  }

  static update(post: Post) {
    const esa = vscode.workspace.getConfiguration("esa");
    const config = {
      method: "patch",
      url: `${this.esaURL}/${esa.teamName}/posts/${post.number}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${esa.accessToken}`,
      },
      data: {
        post: post,
      },
    };

    axios(config)
      .then((response: any) => {
        vscode.window.showInformationMessage(
          `Update post "${response.data.name}"`
        );
      })
      .catch((error: any) => {
        vscode.window.showErrorMessage(
          `Server response status: ${error.status}\nerror: ${error.response.data.error}\nmessage: ${error.response.data.message}`
        );
      });
  }
}
