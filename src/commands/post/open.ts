import { window, workspace, Position } from "vscode";
import { PostService, OPEN_OPTIONS } from "../../services/post";
import { ESA } from "../../models/esa";
import { Exception, LOG_TYPE } from "../../helpers/exception";

export function PostOpen(esa: ESA) {
  try {
    window
      .showQuickPick(OPEN_OPTIONS)
      .then(async (option) => {
        if (!option) throw new Exception("No option selected.", LOG_TYPE.INFO);
        const postService = new PostService(esa);
        return await postService.open(option);
      })
      .then(async (posts) => {
        if (posts.empty())
          throw new Exception("No posts found.", LOG_TYPE.INFO);
        return await window.showQuickPick(posts.items).then((item) => {
          if (!item) throw new Exception("No post selected.", LOG_TYPE.INFO);
          return posts.find(item);
        });
      })
      .then((post) => {
        if (!post)
          throw new Exception("Invalid post selected.", LOG_TYPE.ERROR);
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
