/**
 * 案例：自定义实现 API, 获取实时数据。
 * @file 从自然语言中获取 JSON， 构造特定结构的 JSON 完成参数拼接。
 * @author promptchisel
 * @version 1.0.0
 * @license MIT
 */

import { getAIResponse } from './Prompts_tool.js';
import axios from 'axios';

const GET_WEATHER_METHOD = `API: Get Weather. Input: city. Output: The weather of the city. [METHOD: JSON {"method":"GetWeather","city":"Beijing"}]`;
const GET_STOCK_PRICE_METHOD = `API: Get Stock Price. Input: stock symbol. Output: The price of the stock. [METHOD: JSON {"method":"GetStockPrice","symbol":"AAPL"}]`;

async function getWeather(city) {  // 改为 async 函数
  const API_KEY = '855337f7beec8117b292ccc90a2a384e';
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const tempStr = `当前温度: ${response.data.main.temp}°C \n天气状况: ${response.data.weather[0].description}`;
    return tempStr; // 直接返回数据
  } catch (error) {
    console.error('获取天气失败:', error.message);
    throw error; // 抛出错误供上层处理
  }
}

async function getStockPrice(symbol) {  // 改为 async 函数
  const API_KEY = 'T62IVKQA412KWW5W';
  try {
    const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`);
    const data = response.data['Time Series (Daily)'];
    const latestDate = Object.keys(data)[0];
    const price = data[latestDate]['4. close'];
    const priceStr = `${symbol} 最新股价: ${price} USD`;
    return priceStr; // 返回明确的价格值
  } catch (error) {
    console.error('获取股票数据失败:', error.message);
    throw error; // 抛出错误供上层处理
  }
}

function execMethod(paramsObj) {
  let result;
  switch (paramsObj.method) {
    case "GetWeather":
      result = getWeather(paramsObj.city);
      break;
    case "GetStockPrice":
      result = getStockPrice(paramsObj.symbol);
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
    const result = await execMethod(paramsObj); // 添加 await
    console.log(result);
    console.log("-----------------------------end------------------------------");

    return result;
  } catch (error) {
    console.error('处理请求时发生错误:', error);
    throw error; // 抛出错误供链式调用处理
  }
}

// 执行加法任务
handleAIResponse('查询微软的股票', `${GET_WEATHER_METHOD}, ${GET_STOCK_PRICE_METHOD}`)
  .then(() => sleep(10000)) // 延迟 10 秒
  .then(() => {
    // 执行乘法任务
    return handleAIResponse('查询洛杉矶的天气', `${GET_WEATHER_METHOD}, ${GET_STOCK_PRICE_METHOD}`);
  });

// 工具函数保持原样
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** 示例输出
----------------------------begin-----------------------------
```json
{
  "method": "GetStockPrice",
  "symbol": "MSFT"
}
```
--------------------------------------------------------------
MSFT 最新股价: 510.0600 USD
-----------------------------end------------------------------
----------------------------begin-----------------------------
```json
{
  "method": "GetWeather",
  "city": "Los Angeles"
}
```
--------------------------------------------------------------
当前温度: 19.1°C 
天气状况: scattered clouds
-----------------------------end------------------------------
 */