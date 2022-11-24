import { window, workspace, Position } from "vscode";
import { Post } from "../models/post";
import { PostService, OPEN_OPTIONS } from "../services/post";
import { ESA } from "../models/esa";
import { Exception, LOG_TYPE } from "../helpers/exception";

export class PostCommand {
  esa: ESA;

  constructor(esa: ESA) {
    this.esa = esa;
  }

  static instance(): PostCommand | undefined {
    const esa = new ESA(workspace.getConfiguration("esa"));
    if (esa.isValid()) {
      return new PostCommand(esa);
    } else {
      return undefined;
    }
  }

  open() {
    try {
      window
        .showQuickPick(OPEN_OPTIONS)
        .then(async (option) => {
          if (!option) throw new Exception("No option selected.", LOG_TYPE.INFO);
          const postService = new PostService(this.esa);
          return await postService.open(option);
        })
        .then(async (posts) => {
          if (posts.empty()) throw new Exception("No posts found.", LOG_TYPE.INFO);
          return await window.showQuickPick(posts.items).then((item) => {
            if (!item) throw new Exception("No post selected.", LOG_TYPE.INFO);
            return posts.find(item);
          });
        })
        .then((post) => {
          if (!post) throw new Exception("Invalid post selected.", LOG_TYPE.ERROR);
          return post.generateContent();
        })
        .then((content) => {
          workspace
            .openTextDocument({ language: "markdown" })
            .then((doc) => window.showTextDocument(doc))
            .then((editor) => {
              let startPos = new Position(1, 0);
              editor.edit((edit) => edit.insert(startPos, content));
            });
        });
    } catch (error) {
      if (error instanceof Exception) {
        error.log();
      } else {
        console.log(error);
      }
    }
  }

  update() {
    try {
      const textEditor = window.activeTextEditor;
      if (!textEditor || textEditor.document.languageId != "markdown") {
        throw new Exception(
          "Markdown file is not open. Please open and focus the markdown file you want to update.",
          LOG_TYPE.ERROR
        );
      }

      const content = textEditor.document.getText();
      if (content.trim().length == 0) {
        throw new Exception("No contents. Please open and focus the file with contents.", LOG_TYPE.ERROR);
      }

      const post = Post.cast(content);
      const postService = new PostService(this.esa);
      postService.update(post);
    } catch (error) {
      if (error instanceof Exception) {
        error.log();
      } else {
        console.log(error);
      }
    }
  }
}
