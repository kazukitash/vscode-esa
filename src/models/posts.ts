import * as vscode from "vscode";
import { Post } from "./post";

export class Posts {
  posts: Post[];
  items: vscode.QuickPickItem[];

  constructor(posts: Post[]) {
    this.posts = posts;
    this.items = posts.map((post) => {
      const updated_at = post.updated_at?.format("YYYY/MM/DD HH:mm:ss");
      const user_name = post.created_by?.name;
      return {
        label: post.number.toString(),
        description: post.name,
        detail: `${updated_at} ${user_name}`,
      };
    });
  }

  empty(): boolean {
    return this.posts.length == 0;
  }

  find(item: vscode.QuickPickItem): Post | undefined {
    return this.posts.find((p) => p.number.toString() === item.label);
  }
}
