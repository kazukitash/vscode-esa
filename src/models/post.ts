import * as dayjs from "dayjs";
import { User } from "./User";

export class Post {
  number: number;
  name: string;
  body_md: string;
  wip: boolean;
  created_by: User;
  updated_at: dayjs.Dayjs;

  constructor(post: {
    number: number;
    name: string;
    body_md: string;
    wip: boolean;
    created_by: User;
    updated_at: string;
  }) {
    this.number = post.number;
    this.name = post.name;
    this.body_md = post.body_md;
    this.wip = post.wip;
    this.created_by = post.created_by;
    this.updated_at = dayjs(post.updated_at);
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
