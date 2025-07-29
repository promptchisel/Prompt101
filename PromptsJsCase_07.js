/**
 * Case: Output files in multiple formats
 * @file Files formats can be pptx, docx, xlsx, pdf, etc.
 * @author promptchisel, milesbennett076@gmail.com
 * @version 1.0.0
 * @license
 * Copyright (c) 2025 promptchisel, milesbennett076@gmail.com. All rights reserved.
 * SPDX-License-Identifier: MIT
 */
import OpenAI from "openai";
import fs from 'fs'

async function getFileContent (filename) {
    if (!fs.existsSync(filename)) {
        console.error(`error: file ${filename} not exists`);
        return "file empty";
    }
  const kimi_client = new OpenAI({
    apiKey: 'sk-rvegaX6DqI...',  // Replace with your actual API key
    baseURL: 'https://api.moonshot.cn/v1'
  })
  let file_object = await kimi_client.files.create({
    file: fs.createReadStream(filename),
    purpose: 'file-extract'
  })
  return await (await kimi_client.files.content(file_object.id)).text()
}

async function main() {
    const filename = "AI.pptx";
    const file_content = await getFileContent(filename)
    console.log(`file_content:\n----------------------------\n ${file_content} \n----------------------------`);
}
main();
/**
 * Sample Output:
file_content:
----------------------------
 {"content":"content of AI.pptx ...............","file_type":"application/zip","filename":"AI.pptx","title":"","type":"file"} 
----------------------------
 */