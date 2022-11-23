import * as vscode from "vscode";
import * as dayjs from "dayjs";
import { Post } from "../../models/post";
import { AllIndexOptions } from "../../helpers/indexOptions";
import { PostController } from "../../controllers/post";

let posts: Post[] = new Array<Post>();

export function PostIndexView() {
  try {
    vscode.window
      .showQuickPick(AllIndexOptions)
      .then(async (option) => await getItems(option))
      .then((items) => selectItems(items))
      .then((item) => getContent(item))
      .then((content) => showContent(content));
  } catch (error) {
    if (error instanceof Error) {
      vscode.window.showWarningMessage(error.message);
    }
  }
}

let getItems = async (
  option: string | undefined
): Promise<vscode.QuickPickItem[]> => {
  posts = await PostController.index(option);
  if (posts.length == 0) throw new Error("No posts found.");

  return posts.map((post) => {
    const updated_at = dayjs(post.updated_at).format("YYYY/MM/DD HH:mm:ss");
    const user_name = post.created_by?.name;
    return {
      label: post.number.toString(),
      description: post.name,
      detail: `${updated_at} ${user_name}`,
    };
  });
};

let selectItems = (
  items: vscode.QuickPickItem[]
): Thenable<vscode.QuickPickItem | undefined> => {
  return vscode.window.showQuickPick(items);
};

let getContent = (item: vscode.QuickPickItem | undefined): string => {
  if (!item) throw new Error("No post selected.");

  let post = posts.find((p) => p.number.toString() === item.label);
  if (!post) throw new Error("Invalid post selected.");

  return `---
name: ${post.name}
number: ${post.number}
wip: ${post.wip}
---

${post.body_md}
`;
};

let showContent = (content: string) => {
  vscode.workspace
    .openTextDocument({ language: "markdown" })
    .then((doc) => vscode.window.showTextDocument(doc))
    .then((editor) => {
      let startPos = new vscode.Position(1, 0);
      editor.edit((edit) => {
        edit.insert(startPos, content);
      });
    });
};
