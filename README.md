# 提示词工程实践项目

这是一个关于提示词工程的实践项目，一系列 JavaScript 案例展示如何有效地与大型语言模型（LLM）进行交互 Case 集合。这不是一个 Agent 开发框架，是实现特定的功能 Case 集合，例如获取结构化数据、自定义函数调用、集成实时 API 数据以及处理时间相关查询等。本项目利用 DeepSeek(OpenAI 等也适用) API 作为 LLM 后端，并通过模块化的方式组织代码，方便理解和复用。

## 文件结构

本项目包含以下核心文件：

*   `Prompts_tool.js`
*   `PromptsJsCase_01.js`
*   `PromptsJsCase_02.js`
*   `PromptsJsCase_03.js`
*   `PromptsJsCase_04.js`
*   `PromptsJsCase_05.js`

## 案例详解

### 案例 1: 获取 AI 生成的 JSON 响应 (`PromptsJsCase_01.js`)

**目的:**

此案例演示了如何引导大型语言模型生成结构化的 JSON 数据，并从其响应中解析出所需的信息。这在需要从非结构化文本中提取特定实体或属性时非常有用，例如从一段描述中提取人物的姓名和年龄。

**实现方式:**

通过在提示词中明确指定所需的 JSON 结构示例，LLM 能够理解并生成符合该格式的响应。本案例中，提示词要求 LLM 返回一个包含 `name` 和 `age` 字段的 JSON 对象。`Prompts_tool.js` 中的 `getAIResponse` 函数负责与 DeepSeek API 进行通信，获取原始响应。之后，代码会清理响应字符串（移除 Markdown 代码块标记），并使用 `JSON.parse()` 方法将其转换为 JavaScript 对象。

**关键代码片段:**

```javascript
const prompt = `
  我的同学叫 Alice，她 18 岁。
  请返回 JSON 对象，示例 JSON 结构: 
  { 
    "name": "Miles", 
    "age": 17 
  }
`;
const response = await getAIResponse(prompt);

const cleanedResponse = response.replace(/```json|```/g, "").trim();
const person = JSON.parse(cleanedResponse);

console.log(`姓名: ${person.name}`);
console.log(`年龄: ${person.age}`);
```

**示例输出:**

```
{
  "name": "Alice",
  "age": 18
}

person 对象:  { name: 'Alice', age: 18 }
姓名: Alice
年龄: 18
```




### 案例 2: 自定义实现函数调用 (`PromptsJsCase_02.js`)

**目的:**

此案例展示了如何通过提示词工程实现自定义的函数调用机制。LLM 不直接执行代码，而是根据用户的问题和预定义的函数描述，生成一个包含函数名和参数的 JSON 对象。然后，应用程序解析这个 JSON 对象，并调用相应的本地函数来执行操作。

**实现方式:**

案例中定义了 `sum` 和 `mul` 两个函数，分别用于加法和乘法运算。关键在于向 LLM 提供这些函数的“描述” (`SUM_METHOD`, `MUL_METHOD`)，这些描述包含了函数的输入、输出以及一个特殊的 JSON 格式，用于指示 LLM 在识别到相关意图时生成对应的函数调用信息。`handleAIResponse` 函数负责构建提示词，发送给 LLM，并解析返回的 JSON。解析后，`execMethod` 函数根据 JSON 中的 `method` 字段动态调用本地的 `sum` 或 `mul` 函数。

**关键代码片段:**

```javascript
const SUM_METHOD = `Input: number 1, number 2. Output: Sum of number 1 and number 2. [METHOD: JSON {"method":"sum","num1":"11","num2":"12" }]`;
const MUL_METHOD = `Input: number 1, number 2. Output: Multiplication of number 1 and number 2. [METHOD: JSON {"method":"mul","num1":"11","num2":"12" }]`;

// ... (sum, mul, execMethod 函数定义)

async function handleAIResponse(question, methods) {
  const response = await getAIResponse(
    `[QUESTION: ${question}][METHOD: ${methods}][OUTPUT:请你返回JSON]`
  );
  const cleanedJson = response.replace(/```json|```/g, "");
  const paramsObj = JSON.parse(cleanedJson);
  const result = execMethod(paramsObj);
  console.log(result);
}

handleAIResponse("请你算出来 12 和 15 的和", `${SUM_METHOD}, ${MUL_METHOD}`);
handleAIResponse("请你算出来 12 和 15 的乘积", `${SUM_METHOD}, ${MUL_METHOD}`);
```

**示例输出:**

```
{
  "method": "sum",
  "num1": "12",
  "num2": "15"
}
27

{
  "method": "mul",
  "num1": "12",
  "num2": "15"
}
180
```




### 案例 3: 自定义实现 API, 获取实时数据 (`PromptsJsCase_03.js`)

**目的:**

此案例扩展了函数调用的概念，展示了如何通过 LLM 的意图识别能力，将自然语言查询转化为对外部 API 的调用，从而获取实时数据。这对于构建能够回答实时信息（如天气、股票价格）的智能应用至关重要。

**实现方式:**

与案例 2 类似，本案例也定义了外部 API 的描述 (`GET_WEATHER_METHOD`, `GET_STOCK_PRICE_METHOD`)，并将其作为提示词的一部分传递给 LLM。LLM 根据用户问题（例如“查询微软的股票”或“查询洛杉矶的天气”）生成一个包含 API 方法名和参数的 JSON 对象。`handleAIResponse` 函数解析此 JSON，然后 `execMethod` 函数根据解析出的方法名调用相应的异步函数 (`getWeather` 或 `getStockPrice`)。这些异步函数内部使用 `axios` 库实际调用 OpenWeatherMap 和 Alpha Vantage 等第三方 API 来获取实时数据。

**关键代码片段:**

```javascript
const GET_WEATHER_METHOD = `API: Get Weather. Input: city. Output: The weather of the city. [METHOD: JSON {"method":"GetWeather","city":"Beijing"}]`;
const GET_STOCK_PRICE_METHOD = `API: Get Stock Price. Input: stock symbol. Output: The price of the stock. [METHOD: JSON {"method":"GetStockPrice","symbol":"AAPL"}]`;

// ... (getWeather, getStockPrice, execMethod 函数定义)

async function handleAIResponse(question, methods) {
  const response = await getAIResponse(
    `[QUESTION: ${question}][METHOD: ${methods}][OUTPUT:请你返回JSON]`
  );
  const cleanedJson = response.replace(/```json|```/g, "");
  const paramsObj = JSON.parse(cleanedJson);
  const result = await execMethod(paramsObj); // 注意这里的 await
  console.log(result);
}

handleAIResponse("查询微软的股票", `${GET_WEATHER_METHOD}, ${GET_STOCK_PRICE_METHOD}`);
handleAIResponse("查询洛杉矶的天气", `${GET_WEATHER_METHOD}, ${GET_STOCK_PRICE_METHOD}`);
```

**示例输出:**

```
{
  "method": "GetStockPrice",
  "symbol": "MSFT"
}
MSFT 最新股价: 510.0600 USD

{
  "method": "GetWeather",
  "city": "Los Angeles"
}
当前温度: 19.1°C 
天气状况: scattered clouds
```




### 案例 4: 根据用户问题返回时间戳 (`PromptsJsCase_04.js`)

**目的:**

此案例旨在解决根据用户提出的时间相关问题（例如“最近三周”、“今年夏天以来”）动态计算时间戳的需求。它展示了如何将当前日期信息和季节性时间戳作为上下文提供给 LLM，并引导 LLM 进行时间计算或选择合适的时间戳。

**实现方式:**

首先，代码会计算并提供当前时间戳、当前日期字符串以及春、夏、秋、冬四季的开始时间戳。这些信息被打包成一个 `TODAY_TIME` 结构，作为提示词的一部分发送给 LLM。提示词中还包含了明确的输出要求：如果用户问题与季节相关，则直接使用 `seasonStr` 中的数据；否则，根据当前时间减去时间段进行计算，并要求 LLM 展示完整的计算过程。LLM 的响应会被解析，提取出最终的时间戳。

**关键代码片段:**

```javascript
// 获取季节时间戳的函数
function getSeasonTimestamps() { /* ... */ }

// 集中处理日期信息
const dateInfo = { /* ... */ };

const { spring, summer, autumn, winter } = getSeasonTimestamps();
const seasonStr = `春季开始时间戳: ${spring}, 夏季开始时间戳: ${summer}, 秋季开始时间戳: ${autumn}, 冬季开始时间戳: ${winter}`;

const testCases = [
    '最近三周的热门笔记',
    '最近半年的热门笔记', 
    '今年夏天以来的热门笔记'
];

testCases.forEach(async(testCase) => {
const response = await getAIResponse(`[TODAY_TIME:
  timestamp: ${Math.floor(Date.now() / 1000)} (秒),
  timeStr: ${dateInfo.timeStr},
  seasonStr: ${seasonStr}
]
[USER-QUESTION: ${testCase}]
[OUTPUT:请你按下下面要求计算时间戳，展示完整计算过程
  a. 如果用户问题和季节相关，直接使用 seasonStr 中的数据。
  b. 如果用户问题不涉及季节，时间计算使用当前时间减去时间段
  最后一行单独输出时间戳（单位秒）
]`);
    // ... 解析和打印结果
});
```

**示例输出:**

```
春季开始时间戳: 1738512000, 夏季开始时间戳: 1746374400, 秋季开始时间戳: 1754496000, 冬季开始时间戳: 1762444800
---------------------------- begin ----------------------------
当前日期: 2025-07-23
用户问题为“最近三周的热门笔记”，不涉及季节相关的内容，因此使用当前时间减去时间段的方法来计算时间戳。
计算过程：
1. 当前时间戳：1753234510 秒
2. 三周的时间（以秒为单位）：3 周 × 7 天/周 × 24 小时/天 × 3600 秒/小时 = 1814400 秒
3. 最近三周的开始时间戳：1753234510 - 1814400 = 1751420110 秒
1751420110
解析结果: 1751420110

当前日期: 2025-07-23
用户问题为"最近半年的热门笔记"，不涉及季节相关，因此按照当前时间减去时间段来计算。
计算过程：
1. 当前时间戳：1753234510 秒
2. 半年时间 ≈ 6 个月 × 30 天/月 × 24 小时/天 × 3600 秒/小时 = 15552000 秒
3. 最近半年的时间戳 = 当前时间戳 - 半年时间 = 1753234510 - 15552000 = 1737682510 秒
时间戳（单位秒）：
1737682510
解析结果: 1737682510

当前日期: 2025-07-23
根据用户问题“今年夏天以来的热门笔记”，问题与季节相关，因此直接使用 seasonStr 中的夏季开始时间戳。
夏季开始时间戳: 1746374400
时间戳（单位秒）: 1746374400
解析结果: 时间戳（单位秒）: 1746374400
```




### 案例 5: 生成雷达图数据 (`PromptsJsCase_05.js`)

**目的:**

此案例展示了如何利用 LLM 将非结构化的文本描述（例如面试官对候选人的评估）转化为结构化的数据，以便于后续的数据可视化（如生成雷达图）。这对于自动化报告生成和数据分析非常有用。

**实现方式:**

案例中提供了一段关于候选人面试表现的文本描述 (`candidateA`)。提示词要求 LLM 根据这段描述，生成一个包含特定评估维度（如“协作能力”、“问题解决能力”等）及其对应分数的 JSON 结构。`generateRadarData` 函数负责构建提示词并发送给 LLM。LLM 返回的 JSON 响应经过 `parseResponseData` 函数的清理和解析后，最终通过 `logRadarData` 函数进行格式化输出。

**关键代码片段:**

```javascript
const candidateA = `该候选人在​​编程基础​​方面表现扎实，能够熟练运用数据结构和算法解决问题，代码风格清晰规范。在​​系统设计​​环节，展现了良好的架构思维，能够权衡不同方案的优缺点，并提出可扩展的设计方案。​​问题解决能力​​突出，面对复杂需求时能快速定位核心问题，并给出高效的解决方案。​​工程实践​​经验丰富，熟悉代码优化、测试和调试技巧，具备良好的代码质量意识。此外，候选人的​​协作能力​​较强，沟通表达清晰，能够有效参与技术讨论并融入团队开发流程。`; 

async function generateRadarData() {
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
}

// ... (parseResponseData, logRadarData 函数定义)

generateRadarData();
```

**示例输出:**

```
候选人评估数据:
collaboration: 8
problem_solving: 9
system_design: 8
engineering_practice: 8
programming_fundamentals: 9
```

前端请求到这个数据后，可以渲染雷达图。

<div align="center">
  <img src="./public/radar_cn.png" alt="雷达图" style="width: 42%;"> <!-- 添加width:60%样式 -->
</div>

