import { window, workspace, Position } from "vscode";
import { IndexOptions, AllIndexOptions } from "../../helpers/indexOptions";
import { PostController } from "../../controllers/post";
import { ESAConfig } from "../../models/esaConfig";
import { Exception, LOGTYPE } from "../../helpers/exception";

export function PostIndexView(esaConfig: ESAConfig) {
  try {
    window
      .showQuickPick(AllIndexOptions)
      .then(async (option) => {
        const q = option === IndexOptions.Own ? `@${esaConfig.userName}` : "";
        return await PostController.index(esaConfig, q);
      })
      .then(async (posts) => {
        if (posts.empty()) throw new Exception("No posts found.", LOGTYPE.INFO);
        return await window.showQuickPick(posts.items).then((item) => {
          if (!item) throw new Exception("No post selected.", LOGTYPE.INFO);
          return posts.find(item);
        });
      })
      .then((post) => {
        if (!post) throw new Exception("Invalid post selected.", LOGTYPE.ERROR);
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
