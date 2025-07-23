/**
 * Case: Custom function calling implementation
 * @file Get JSON from natural language, parse JSON to complete function selection and parameter binding.
 * @author promptchisel, milesbennett076@gmail.com
 * @version 1.0.0
 * @license
 * Copyright (c) 2025 promptchisel, milesbennett076@gmail.com. All rights reserved.
 * SPDX-License-Identifier: MIT
 */

import { getAIResponse } from './Prompts_tool.js';

// Method description constants
const SUM_METHOD = `Input: number 1, number 2. Output: Sum of numbers. [METHOD: JSON {"method":"sum","num1":"11","num2":"12" }]`;
const MUL_METHOD = `Input: number 1, number 2. Output: Product of numbers. [METHOD: JSON {"method":"mul","num1":"11","num2":"12" }]`;

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
      throw new Error(`Unknown method: ${paramsObj.method}`);
  }
  return result;
}

// Generic response handler
async function handleAIResponse(question, methods) {
  try {
    const response = await getAIResponse(
      `[QUESTION: ${question}][METHOD: ${methods}][OUTPUT: Please return JSON]`
    );
    
    const cleanedJson = response.replace(/```json|```/g, '');
    const paramsObj = JSON.parse(cleanedJson);
    
    console.log("----------------------------begin-----------------------------");
    console.log(response);
    console.log("--------------------------------------------------------------");
    const result = execMethod(paramsObj);
    console.log(result);
    console.log("----------------------------- end ----------------------------");
    
    return result;
  } catch (error) {
    console.error('Error processing request:', error);
  }
}

// Execute addition task
handleAIResponse('Please calculate the sum of 12 and 15', `${SUM_METHOD}, ${MUL_METHOD}`)
  .then(() => sleep(10000))
  .then(() => {
    // Execute multiplication task
    return handleAIResponse('Please calculate the product of 12 and 15', `${SUM_METHOD}, ${MUL_METHOD}`);
  });

/** Sample Output:
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
----------------------------- end ----------------------------
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
----------------------------- end ----------------------------
*/

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}