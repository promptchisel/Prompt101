/**
 * 案例：生成雷达图
 * @file 根据候选人的面试表现生成雷达图数据
 * @author promptchisel
 * @version 1.0.0
 * @license MIT
 */
import { getAIResponse } from './Prompts_tool.js';

// 这是面试过程的一些文本，和编程代码。这不是我们的重点，但是我们这里是简单构造一下。 
const candidateA = `候选人的项目经验很好，和匹配。专业知识理论也很强。但是编程算法题表现不是很好。`; getAIResponse("请你根据以上信息，返回一个 JSON 结构，包含项目经验、专业理论、编程水平三个字段。例如：{Project: 71, Theory: 60, Programming : 66}").then(response => {
  console.log("----------------------------begin-----------------------------");
  console.log(response);
  console.log("-----------------------------end------------------------------");
  const person = JSON.parse(response.replace("```json", "").replace("```", "") ); 
  console.log(person);
  console.log("Project: " + person.Project);
  console.log("Theory: " + person.Theory);
  console.log("Programming: " + person.Programming);
});
/**

----------------------------begin-----------------------------
```json
{
  "Project": 85,
  "Theory": 80,
  "Programming": 60
}
```
-----------------------------end------------------------------
{ Project: 85, Theory: 80, Programming: 60 }
Project: 85
Theory: 80
Programming: 60
 */