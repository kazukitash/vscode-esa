import { window } from "vscode";
import { Post } from "../../models/post";
import { PostService } from "../../services/post";
import { ESA } from "../../models/esa";
import { Exception, LOG_TYPE } from "../../helpers/exception";

export function PostUpdate(esa: ESA) {
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
      throw new Exception(
        "No contents. Please open and focus the file with contents.",
        LOG_TYPE.ERROR
      );
    }

    const post = Post.cast(content);
    const postService = new PostService(esa);
    postService.update(post);
  } catch (error) {
    if (error instanceof Exception) {
      error.log();
    } else {
      console.log(error);
    }
  }
}
