/**
 * 案例：获取AI生成的JSON响应
 * @file 演示如何从AI获取结构化JSON数据并解析
 * @author promptchisel
 * @version 1.0.0
 * @license MIT
 */

import { getAIResponse } from './Prompts_tool.js';

/**
 * 主函数 - 获取并处理AI生成的JSON响应
 * @async
 * @function main
 * @returns {Promise<Object>} 解析后的用户数据对象
 * @throws {Error} 处理过程中发生的错误
 */
async function main() {
  try {
    const prompt = `
      我的同学叫 Alice，她 18 岁。
      请返回 JSON 对象，示例 JSON 结构: 
      { 
        "name": "Miles", 
        "age": 17 
      }
    `;
    const response = await getAIResponse(prompt);
    
    // 打印原始响应
    console.log("----------------------------response-BEGIN-----------------------------");
    console.log(response);
    console.log("-----------------------------response-END------------------------------");
    
    // 清理并解析JSON
    const cleanedResponse = response.replace(/```json|```/g, '').trim();
    const person = JSON.parse(cleanedResponse);
    
    // 打印解析结果
    console.log('person 对象: ', person);
    console.log(`姓名: ${person.name}`);
    console.log(`年龄: ${person.age}`);
    
    return person;
  } catch (error) {
    console.error('处理AI响应时出错:', {
      error: error.message,
      stack: error.stack,
      response: response || '无响应内容' // 添加错误上下文
    });
    throw error;
  }
}

// 执行主函数
main().catch(console.error);

/**
 * @example
 * ----------------------------BEGIN-----------------------------
 * ```json
 * {
 *   "name": "Alice",
 *   "age": 18
 * }
 * ```
 * -----------------------------END------------------------------
 * person 对象:  { name: 'Alice', age: 18 }
 * 姓名: Alice
 * 年龄: 18
 */