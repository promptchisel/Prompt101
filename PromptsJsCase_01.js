// Case Name: 返回 JSON。
// user: prompt
import axios from 'axios';
import { getAIResponse } from './Prompts_tool.js';

// 原调用方式改为：
getAIResponse("我的同学叫 Alice, 她 18 岁，请返回这个 JSON结构: {name: Miles, age: 17}").then(response => {
  console.log("----------------------------begin-----------------------------");
  console.log(response);
  console.log("-----------------------------end------------------------------");
  const person = JSON.parse(response.replace("```json", "").replace("```", "") );
  console.log(person);
  console.log("name: " + person.name);
  console.log("age: " + person.age);
});
/**
----------------------------begin-----------------------------
```json
{
  "name": "Alice",
  "age": 18
}
```
-----------------------------end------------------------------
{ name: 'Alice', age: 18 }
name: Alice
age: 18
 */