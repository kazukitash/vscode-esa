import { Dayjs } from "dayjs";
import { Exception, LOGTYPE } from "../helpers/exception";
import { User } from "./User";

export class Post {
  number: number;
  name: string;
  body_md: string;
  wip: boolean;
  created_by?: User;
  updated_at?: Dayjs;

  constructor(post: {
    number: number;
    name: string;
    body_md: string;
    wip: boolean;
    created_by?: User;
    updated_at?: string;
  }) {
    this.number = post.number;
    this.name = post.name;
    this.body_md = post.body_md;
    this.wip = post.wip;
    if (post.created_by) this.created_by = post.created_by;
    if (post.updated_at) this.updated_at = new Dayjs(post.updated_at);
  }

  static decode(post: any): Post | undefined {
    if (!post.number) return undefined;
    if (!post.name) return undefined;
    if (!post.body_md) return undefined;
    if (!post.wip) return undefined;
    if (!post.created_by) return undefined;
    if (!post.updated_at) return undefined;
    return new Post(post);
  }

  static cast(content: string) {
    const PATTERN = /^\s*---\s*\n((?:\s*[^\s:]+\s*:[^\n]*\n)+)---\s*\n/g;

    const match = PATTERN.exec(content);
    if (!match) {
      throw new Exception(
        "No metadata found. Contents should include metadata.",
        LOGTYPE.ERROR
      );
    }

    const body_md = content
      .substring(match[0].trim().length)
      .replace(/^\s+/, "");
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
      throw new Exception(
        "metadata(name:) is not found. Name should be included in metadata.",
        LOGTYPE.ERROR
      );
    }
    if (!metadata.number) {
      throw new Exception(
        "metadata(number:) is not found. Number should be include in metadata.",
        LOGTYPE.ERROR
      );
    }
    if (!metadata.wip) metadata.wip = true;

    return new Post({
      number: Number(metadata.number),
      name: metadata.name,
      body_md: body_md,
      wip: metadata.wip,
    });
  }

  generateContent(): string {
    return `---
name: ${this.name}
number: ${this.number}
wip: ${this.wip}
---

${this.body_md}
`;
  }
}
