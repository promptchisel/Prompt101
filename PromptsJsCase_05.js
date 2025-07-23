/**
 * 案例：生成雷达图
 * @file 根据候选人的面试表现生成雷达图数据
 * @author promptchisel
 * @version 1.0.0
 * @license MIT
 */

import { getAIResponse } from './Prompts_tool.js';

// 候选人数据样例
const candidateA = `该候选人在​​编程基础​​方面表现扎实，能够熟练运用数据结构和算法解决问题，代码风格清晰规范。在​​系统设计​​环节，展现了良好的架构思维，能够权衡不同方案的优缺点，并提出可扩展的设计方案。​​问题解决能力​​突出，面对复杂需求时能快速定位核心问题，并给出高效的解决方案。​​工程实践​​经验丰富，熟悉代码优化、测试和调试技巧，具备良好的代码质量意识。此外，候选人的​​协作能力​​较强，沟通表达清晰，能够有效参与技术讨论并融入团队开发流程。`; 

// 核心处理函数
async function generateRadarData() {
    try {
        const response = await getAIResponse(
            `[面试信息:${candidateA}][输出描述：请你根据以上信息，返回一个 JSON 结构，包含：协作能力​，问题解决能力​，系统设计，工程实践维度，编程基础，5个字段。结构示例： {
    "collaboration": 8,
    "problem_solving": 9,
    "system_design": 8,
    "engineering_practice": 7,
    "programming_fundamentals": 9
  }`
            );

        const parsedData = parseResponseData(response);
        logRadarData(parsedData);
        return parsedData;
    } catch (error) {
        console.error('数据处理失败:', error.message);
        throw error;
    }
}

// 数据处理函数
function parseResponseData(response) {
    try {
        const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedResponse);
    } catch (error) {
        throw new Error(`JSON 解析失败: ${error.message}`);
    }
}

// 数据输出格式化
function logRadarData(data) {
    const separator = '----------------------------';
    console.log(`${separator} begin ${separator}`);
    
    console.log('候选人评估数据:');
    Object.entries(data).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
    });
    
    console.log(`${separator}  end  ${separator}\n`);
}
    
// 执行主函数
generateRadarData()
    .then(() => console.log('雷达图数据生成完成'))
    .catch(error => console.error('流程异常:', error.message));

/**
---------------------------- begin ----------------------------
候选人评估数据:
collaboration: 8
problem_solving: 9
system_design: 8
engineering_practice: 8
programming_fundamentals: 9
---------------------------- end ----------------------------
*/