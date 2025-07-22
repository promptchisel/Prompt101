import axios from 'axios';
import { getAIResponse } from './Prompts_tool.js';
import { setMaxIdleHTTPParsers } from 'http';

const method1 = `Input: number 1, number 2. Output: Sum of number 1 and number 2. [METHOD: JSON {"method":"sum","num1":"11","num2":"12" }]`;
const method2 = `Input: number 1, number 2. Output: Multiplication of number 1 and number 2. [METHOD: JSON {"method":"mul","num1":"11","num2":"12" }]`;

function sum(num1, num2) {
  return Number(num1) + Number(num2);
}

function mul(num1, num2) {
  return Number(num1) * Number(num2);
}

function execMethod(paramsObj) {
  let result;
  const method = paramsObj.method;
  switch (method) {
    case "sum":
      result = sum(paramsObj.num1, paramsObj.num2);
      break;
    case "mul":
      result = mul(paramsObj.num1, paramsObj.num2);
      break;
    default:
      break;
  }
  // console.log(result);
  return result;
}

getAIResponse(`[QUESTION: 请你算出来 12 和 15 的和][METHOD: ${method1}, ${method2}][OUTPUT:请你返回JSON]`).then(response => {
  console.log("sum res: ", response);
  const paramsObj = JSON.parse(response.replace("```json", "").replace("```", ""));
  console.log("----------------------------begin-----------------------------");
  const result = execMethod(paramsObj);
  console.log(result);
  console.log("-----------------------------end------------------------------");
});

// sleep 10s
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
sleep(10000);

getAIResponse(`[QUESTION: 请你算出来 12 和 15 的乘积][METHOD: ${method1}, ${method2}][OUTPUT:请你返回JSON]`).then(response => {
  console.log("mul res: ", response);
  const paramsObj = JSON.parse(response.replace("```json", "").replace("```", ""));
  console.log("----------------------------begin-----------------------------");
  const result = execMethod(paramsObj);
  console.log(result);
  console.log("-----------------------------end------------------------------");
});

/**
sum res:  ```json
{
  "method": "sum",
  "num1": "12",
  "num2": "15"
}
```
----------------------------begin-----------------------------
27
-----------------------------end------------------------------
mul res:  ```json
{
  "method": "mul",
  "num1": "12",
  "num2": "15"
}
```
----------------------------begin-----------------------------
180
-----------------------------end------------------------------
 */