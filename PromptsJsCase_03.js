/**
 * Case Name: Custom implementation of API to get real-time data.
 * @file From natural language, get JSON, and construct specific JSON structure to complete parameter concatenation.
 * @author promptchisel, milesbennett076@gmail.com
 * @version 1.0.0
 * @license
 * Copyright (c) 2025 promptchisel, milesbennett076@gmail.com. All rights reserved.
 * SPDX-License-Identifier: MIT
 */


import { getAIResponse } from './Prompts_tool.js';
import axios from 'axios';

const GET_WEATHER_METHOD = `API: Get Weather. Input: city. Output: The weather of the city. [METHOD: JSON {"method":"GetWeather","city":"Beijing"}]`;
const GET_STOCK_PRICE_METHOD = `API: Get Stock Price. Input: stock symbol. Output: The price of the stock. [METHOD: JSON {"method":"GetStockPrice","symbol":"AAPL"}]`;

async function getWeather(city) {  // 改为 async 函数
  const API_KEY = '855337f7beec8117b292ccc90a2a384e';
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const tempStr = `Current temperature: ${response.data.main.temp}°C \nWeather condition: ${response.data.weather[0].description}`;
    return tempStr; // 直接返回数据
  } catch (error) {
    console.error('Failed to get weather:', error.message);
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
    const priceStr = `${symbol} latest stock price: ${price} USD`;
    return priceStr;
  } catch (error) {
    console.error('Failed to get stock price:', error.message);
    throw error;
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
      throw new Error(`Unknown method: ${paramsObj.method}`);
  }
  return result;
}

// 通用响应处理函数
async function handleAIResponse(question, methods) {
  try {
    const response = await getAIResponse(
      `[QUESTION: ${question}][METHOD: ${methods}][OUTPUT:Please return JSON]`
    );

    const cleanedJson = response.replace(/```json|```/g, '');
    const paramsObj = JSON.parse(cleanedJson);

    console.log("----------------------------begin-----------------------------");
    console.log(response);
    console.log("--------------------------------------------------------------");
    const result = await execMethod(paramsObj);
    console.log(result);
    console.log("-----------------------------end------------------------------");

    return result;
  } catch (error) {
    console.error('Failed to handle request:', error);
    throw error;
  }
}

handleAIResponse('Query Microsoft stock', `${GET_WEATHER_METHOD}, ${GET_STOCK_PRICE_METHOD}`)
  .then(() => sleep(10000))
  .then(() => {
    return handleAIResponse('Query Los Angeles weather', `${GET_WEATHER_METHOD}, ${GET_STOCK_PRICE_METHOD}`);
  });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Sample Output:
----------------------------begin-----------------------------
```json
{
  "method": "GetStockPrice",
  "symbol": "MSFT"
}
```
--------------------------------------------------------------
MSFT latest stock price: 505.8700 USD
-----------------------------end------------------------------
----------------------------begin-----------------------------
```json
{
  "method": "GetWeather",
  "city": "Los Angeles"
}
```
--------------------------------------------------------------
Current temperature: 18.39°C 
Weather condition: clear sky
-----------------------------end------------------------------
 */