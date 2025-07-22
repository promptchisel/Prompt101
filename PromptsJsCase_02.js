/**
 * 案例：自定义实现函数调用
 * @file 从自然语言中获取 JSON， 解析 JSON 完成函数选择，参数拼接。
 * @author promptchisel
 * @version 1.0.0
 * @license MIT
 */

import { getAIResponse } from './Prompts_tool.js';

// 方法描述常量
const SUM_METHOD = `Input: number 1, number 2. Output: Sum of number 1 and number 2. [METHOD: JSON {"method":"sum","num1":"11","num2":"12" }]`;
const MUL_METHOD = `Input: number 1, number 2. Output: Multiplication of number 1 and number 2. [METHOD: JSON {"method":"mul","num1":"11","num2":"12" }]`;

function sum(num1, num2) {
  return Number(num1) + Number(num2);
}

function mul(num1, num2) {
  return Number(num1) * Number(num2);
}

function execMethod(paramsObj) {
  let result;
  switch (paramsObj.method) {
    case "sum":
      result = sum(paramsObj.num1, paramsObj.num2);
      break;
    case "mul":
      result = mul(paramsObj.num1, paramsObj.num2);
      break;
    default:
      throw new Error(`未知方法: ${paramsObj.method}`);
  }
  return result;
}

// 通用响应处理函数
async function handleAIResponse(question, methods) {
  try {
    const response = await getAIResponse(
      `[QUESTION: ${question}][METHOD: ${methods}][OUTPUT:请你返回JSON]`
    );
    
    const cleanedJson = response.replace(/```json|```/g, '');
    const paramsObj = JSON.parse(cleanedJson);
    
    console.log("----------------------------begin-----------------------------");
    console.log(response);
    console.log("--------------------------------------------------------------");
    const result = execMethod(paramsObj);
    console.log(result);
    console.log("-----------------------------end------------------------------");
    
    return result;
  } catch (error) {
    console.error('处理请求时发生错误:', error);
  }
}

// 执行加法任务
handleAIResponse('请你算出来 12 和 15 的和', `${SUM_METHOD}, ${MUL_METHOD}`)
  .then(() => sleep(10000)) // 延迟 10 秒
  .then(() => {
    // 执行乘法任务
    return handleAIResponse('请你算出来 12 和 15 的乘积', `${SUM_METHOD}, ${MUL_METHOD}`);
  });

// 工具函数保持原样
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** 示例输出
----------------------------begin-----------------------------
```json
{
  "method": "sum",
  "num1": "12",
  "num2": "15"
}
```
--------------------------------------------------------------
27
-----------------------------end------------------------------
----------------------------begin-----------------------------
```json
{
  "method": "mul",
  "num1": "12",
  "num2": "15"
}
```
--------------------------------------------------------------
180
-----------------------------end------------------------------
 */