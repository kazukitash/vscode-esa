import * as vscode from "vscode";
const axios = require("axios");

import { Post } from "../models/post";
import { IndexOptions } from "../models/indexOptions";

export class PostController {
  static esaURL = "https://api.esa.io/v1/teams";

  static async index(option: string | undefined): Promise<Post[]> {
    var posts = new Array<Post>();

    if (!option) return posts;

    const config = vscode.workspace.getConfiguration("esa");
    const params = {
      params: {
        access_token: config.accessToken,
        q: option === IndexOptions.Own ? `@${config.userName}` : "",
      },
    };

    vscode.window.setStatusBarMessage("Requesting posts ...", 2000);
    const response = await axios
      .get(`${this.esaURL}/${config.teamName}/posts`, params)
      .catch((error: any) => {
        throw new Error(
          `Server response status: ${error.status}\nerror: ${error.response.data.error}\nmessage: ${error.response.data.message}`
        );
      });

    if (response.headers["content-type"].includes("json")) {
      posts = response.data.posts;
    }

    return posts;
  }
}
