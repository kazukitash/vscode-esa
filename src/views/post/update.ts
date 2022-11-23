import { window } from "vscode";
import { Post } from "../../models/post";
import { PostController } from "../../controllers/post";
import { ESAConfig } from "../../models/esaConfig";
import { Exception, LOGTYPE } from "../../helpers/exception";

export function PostUpdateView(esaConfig: ESAConfig) {
  try {
    const textEditor = window.activeTextEditor;
    if (!textEditor || textEditor.document.languageId != "markdown") {
      throw new Exception(
        "Markdown file is not open. Please open and focus the markdown file you want to update.",
        LOGTYPE.ERROR
      );
    }

    const content = textEditor.document.getText();
    if (content.trim().length == 0) {
      throw new Exception(
        "No contents. Please open and focus the file with contents.",
        LOGTYPE.ERROR
      );
    }

    const post = Post.cast(content);
    PostController.update(esaConfig, post);
  } catch (error) {
    if (error instanceof Exception) {
      error.log();
    } else {
      console.log(error);
    }
  }
}
