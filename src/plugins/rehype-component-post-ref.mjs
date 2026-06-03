/// <reference types="mdast" />
import { h } from "hastscript";
import { readFileSync } from "fs";
import path from "path";


/**
 * 使用正则提取 frontmatter 中的 postID
 * @param {string} fileContent - 文件完整内容
 * @returns {string|null}
 */
function extractPostIdByRegex(fileContent) {
  const frontmatterRegex = /^--- *\r?\n([\s\S]*?)\r?\n---/;
  const match = frontmatterRegex.exec(fileContent);
  
  if (!match) return null;

  const yamlBlock = match[1];
  const lines = yamlBlock.split(/\r?\n/);
  
  let result = { id: null, title: null };
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith("postID:")) {
      let value = trimmed.slice(7).trim();
      // 去引号
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      // 去除行内注释
      const hashIndex = value.indexOf('#');
      if (hashIndex !== -1) {
        value = value.slice(0, hashIndex).trim();
      }
      result.id = value || null;
    } 
    else if (trimmed.startsWith("title:")) {
      let value = trimmed.slice(6).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      // 标题一般不需要去注释，但为了统一代码格式一并操作
      const hashIndex = value.indexOf('#');
      if (hashIndex !== -1) {
        value = value.slice(0, hashIndex).trim();
      }
      result.title = value || null;
    }
  }
  
  return result;
}


export function PostRefComponent(properties, children) {

    if (Array.isArray(children) && children.length !== 0) {
		return h("div", { }, [
			'Invalid directive. ("post" directive must be leaf type ":post{dir="your/post/dir" text="link text(optional)")',
		]);
    }


    const postDir = properties.dir;
    const linkText = properties.text;
    if (!postDir) {
        return h("div", { }, [
			'Invalid directive. ("post" directive must has "dir" property.)',
		]);
    }

    const postRoot = "src/content/posts";
    const targetFile = path.resolve(postRoot, postDir);
    let postResult = null;
    let fileExists = false;

    try {
        const fileContent = readFileSync(targetFile, "utf-8");
        fileExists = true;
        postResult = extractPostIdByRegex(fileContent);
    } catch (error) {
        console.log(`An error occurred while reading file: ${targetFile}`, error);
    }

    if (!fileExists) {
        return h("div", {}, [
            `The post at dir "${postDir}" is not found under root: "${postRoot}".`
        ]);
    }

    if (!postResult.id) {
        return h("div", {}, [
            `The post at dir "${postDir}" under "${postRoot}" doesn't have a post id.`
        ]);
    }

    const displayName = (!linkText) ? postResult.title : linkText;
    
    return h("a", {
        href: `/posts/${postResult.id}`,
        class: "link",
        "id": postResult.id,
    }, [
        h("span", {class: "post-ref-title"}, displayName),
    ]);
}
