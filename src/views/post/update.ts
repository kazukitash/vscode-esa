import * as vscode from "vscode";

import { Post } from "../../models/post";
import { PostController } from "../../controllers/post";

export function PostUpdateView() {
  try {
    const textEditor = checkActiveText();
    const content = getContent(textEditor);
    let post = generatePost(content);
    PostController.update(post);
  } catch (error) {
    if (error instanceof Error) {
      vscode.window.showWarningMessage(error.message);
    }
  }
}

let checkActiveText = (): vscode.TextEditor => {
  const activeTextEditor = vscode.window.activeTextEditor;
  let textEditor: vscode.TextEditor;
  if (activeTextEditor && activeTextEditor.document.languageId === "markdown") {
    textEditor = activeTextEditor;
  } else {
    throw new Error(
      "Markdown file is not open. Please open and focus the markdown file you want to update."
    );
  }
  return textEditor;
};

let getContent = (textEditor: vscode.TextEditor): string => {
  const content = textEditor.document.getText();
  if (content.trim().length == 0) {
    throw new Error(
      "No contents. Please open and focus the file with contents."
    );
  }
  return content;
};

let generatePost = (content: string): Post => {
  const METADATA_PATTERN =
    /^---[ \t]*\n((?:[ \t]*[^ \t:]+[ \t]*:[^\n]*\n)+)---[ \t]*\n/;

  const match = METADATA_PATTERN.exec(content);
  if (!match) {
    throw new Error("No metadata found. Contents should include metadata.");
  }

  const body_md = content.substring(match[0].trim().length).replace(/^s+/, "");
  let metadata: any = {};
  match[1]
    .trim()
    .split("\n")
    .forEach((meta) => {
      const entry = meta.split(":");
      const key = entry[0].trim();
      const value = entry[1].trim();
      metadata[key] = value;
    });

  if (!metadata.name) {
    throw new Error(
      "metadata(name:) is not found. Name should be included in metadata."
    );
  }
  if (!metadata.number) {
    throw new Error(
      "metadata(number:) is not found. Number should be include in metadata."
    );
  }
  if (!metadata.wip) metadata.wip = true;

  return {
    body_md: body_md,
    name: metadata.name,
    number: Number(metadata.number),
    wip: metadata.wip,
  } as Post;
};
