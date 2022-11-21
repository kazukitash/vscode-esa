import * as vscode from "vscode";
const axios = require("axios");

import { Post } from "../models/post";
import { IndexOptions } from "../models/indexOptions";

export class PostController {
  static esaURL = "https://api.esa.io/v1/teams";

  static async index(option: string | undefined): Promise<Post[]> {
    var posts = new Array<Post>();

    if (!option) return posts;

    const esa = vscode.workspace.getConfiguration("esa");
    const config = {
      method: "get",
      url: `${this.esaURL}/${esa.teamName}/posts`,
      params: {
        access_token: esa.accessToken,
        q: option === IndexOptions.Own ? `@${esa.userName}` : "",
      },
    };

    vscode.window.setStatusBarMessage("Requesting posts ...", 2000);
    const response = await axios(config).catch((error: any) => {
      throw new Error(
        `Server response status: ${error.status}\nerror: ${error.response.data.error}\nmessage: ${error.response.data.message}`
      );
    });

    if (response.headers["content-type"].includes("json")) {
      posts = response.data.posts;
    }

    return posts;
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
