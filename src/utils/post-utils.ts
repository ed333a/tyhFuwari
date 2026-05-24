// 用于自动生成 postID
// 来源: https://blog.mcxiaochen.top/posts/p403bf94e/
// 经过修改

import { devConfig } from "@/types/config";
import fs from "fs"
import path from "path"
import crc32 from "crc-32"

const POST_DIR = "src/content/posts";

function walk(dir: string): string[] {
  return fs.readdirSync(dir).flatMap((file: string) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      return walk(fullPath);
    }
    return fullPath.endsWith(".md") ? [fullPath] : [];
  });
}

// 设置一个 Set 储存已经存在的 postID 
// 防止冲突, 若冲突则在原有计算内容方式上结尾加上一个数字盐
// 每一次计算如果冲突该数字盐自增 1
const postIDs = new Set();

// 遍历所有文章, 取出 postID
const postFiles: string[] = walk(POST_DIR);

for (const post of postFiles) {
    const content: string = fs.readFileSync(post, "utf-8");
    const match: RegExpMatchArray | null = content.match(/postID:\s*(\S+)/);
    if (match) {
        postIDs.add(match[1]);
    }
}

if (devConfig.debug) {
    console.log("post id(s): " + (postIDs.size > 0 ? '[' + Array.from(postIDs).join(', ') + ']' : "[]"))
}

// 开始处理
for (const post of postFiles) {
    const content = fs.readFileSync(post, "utf-8");
    if(content.includes("postID:")) continue; // 如果文章中已有 postID 则跳过处理

    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) {
        console.log(`[Post-utils] ⚠ 跳过无 frontmatter 文件: ${post}`);
        continue;
    }

    // 生成 crc32 校验值
    let salt = 0, final: string;
    do {
        const base = path.basename(post) + (salt || "");
        final = (crc32.str(base) >>> 0).toString(16);
        salt++;
    } while (postIDs.has(final));

    postIDs.add(final);
    const newFrontmatter = `---\n${match[1].trimEnd()}\npostID: ${final} # 不要修改这个项目的值\n---`
    const newContent = content.replace(match[0], newFrontmatter);
    fs.writeFileSync(post, newContent);

    console.log(`[Post-utils] 为文章 ${post} 生成了文章 id: ${final}.`)
}