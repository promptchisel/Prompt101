# Prompt Engineering 项目指南

此开源项目展示如何通过自然语言提示（Prompt Engineering）实现结构化数据提取、函数调用和 API 集成。

## 项目结构
\`\`\`
prompt-engineering/
├── Prompts_tool.js        # 核心AI响应获取模块
├── case1_function_calls.js
├── case2_api_integration.js
├── case3_timestamp_generation.js
├── case4_radar_chart.js
├── radar_chart.html       # 雷达图可视化
└── case5_json_extraction.js
\`\`\`

## 案例介绍

### 案例1: 自定义函数调用
**文件**: \`case1_function_calls.js\`  
**功能**: 从自然语言中提取JSON参数并执行函数  
**核心特点**:
- 结构化提示词生成标准JSON
- 支持动态调用多函数（加法/乘法）
- 自动解析JSON并可视化结果

**使用示例**:
\`\`\`javascript
handleAIResponse('计算12和15的和', \`\${SUM_METHOD}, \${MUL_METHOD}\`)
\`\`\`

---

### 案例2: API集成与实时数据获取
**文件**: \`case2_api_integration.js\`  
**功能**: 通过自然语言查询实时数据（天气/股票）  
**API支持**:
- 天气: \`GetWeather\`
- 股票: \`GetStockPrice\`

**使用示例**:
\`\`\`javascript
handleAIResponse('查询微软股票', \`\${GET_WEATHER_METHOD}, \${GET_STOCK_PRICE_METHOD}\`)
\`\`\`

---

### 案例3: 智能时间戳生成
**文件**: \`case3_timestamp_generation.js\`  
**功能**: 自然语言时间 → 精确时间戳  
**处理逻辑**:
1. **季节时间**：预定义春/夏/秋/冬时间戳
2. **相对时间**：动态计算偏移量（如"最近三周"）

**输出格式**：
\`\`\`
1751420110  // Unix时间戳（秒）
\`\`\`

---

### 案例4: 雷达图数据生成
**文件**: \`case4_radar_chart.js\`  
**配套可视化**: \`radar_chart.html\`（使用Chart.js）  
**处理流程**:
1. 输入文本评价 → 提取5维度评分：
   - 协作能力 | 问题解决 | 系统设计 | 工程实践 | 编程基础
2. 输出标准JSON → 自动可视化

**输出示例**:
\`\`\`json
{
  "collaboration": 8,
  "problem_solving": 9,
  "system_design": 8,
  "engineering_practice": 8,
  "programming_fundamentals": 9
}
\`\`\`

---

### 案例5: JSON数据结构化提取
**文件**: \`case5_json_extraction.js\`  
**核心特点**:
- 响应数据自动清洗
- JSON解析与验证
- 字段精准提取

**使用示例**:
\`\`\`javascript
const prompt = "我的同学叫 Alice，她18岁。请返回JSON对象...";
const response = await getAIResponse(prompt);
\`\`\`

---

## 核心工具模块
\`Prompts_tool.js\` 提供统一AI请求接口：
\`\`\`javascript
async function getAIResponse(userQuestion) {
  // 配置DeepSeek API参数
  // 返回AI生成的文本响应
}
\`\`\`

---

## 使用说明
1. 安装依赖: \`npm install axios\`
2. 配置API密钥（替换文件中的密钥占位符）
3. 运行案例: \`node case1_function_calls.js\`
4. 查看雷达图: 浏览器打开 \`radar_chart.html\`

---

## 贡献指南
1. Fork 本项目
2. 创建分支: \`git checkout -b feature/your-feature\`
3. 提交更改: \`git commit -am '新增功能'\`
4. 推送分支: \`git push origin feature/your-feature\`
5. 创建 Pull Request

**许可证**: MIT