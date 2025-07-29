/**
 * @file This is a utility function for sending requests to the DeepSeek API and obtaining responses.
 * @author promptchisel, milesbennett076@gmail.com
 * @version 1.0.0
 * @license
 * Copyright (c) 2025 promptchisel, milesbennett076@gmail.com. All rights reserved.
 * SPDX-License-Identifier: MIT
 */

import axios from 'axios';

// Extract API configuration constants
const API_URL = 'https://api.deepseek.com/chat/completions';
const API_KEY = 'Bearer sk-b07......'; // replace with your actual API key

export async function getAIResponse(userQuestion) {
  // Split request data configuration
  const requestData = {
    messages: [
      {
        content: "You are a helpful assistant",
        role: "system"
      },
      {
        content: userQuestion,
        role: "user"
      }
    ],
    model: "deepseek-chat",
    // Parameters with default values use spread syntax
    ...{
      frequency_penalty: 0,
      max_tokens: 2048,
      presence_penalty: 0,
      temperature: 1,
      top_p: 1
    },
    response_format: { type: "text" },
    stream: false
  };

  // Structured configuration object
  const config = {
    method: 'post',
    url: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': API_KEY
    },
    data: requestData,
    maxBodyLength: Infinity
  };

  try {
    const response = await axios(config);
    return response.data.choices[0].message.content;
  } catch (error) {
    // Enhanced error handling
    console.error('API request failed:', error.response?.data || error.message);
    return ""; 
  }
}