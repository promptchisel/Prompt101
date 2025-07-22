import axios from 'axios';

// 新增异步函数
export async function getAIResponse(userQuestion) {
  const data = JSON.stringify({
    "messages": [
      {
        "content": "You are a helpful assistant",
        "role": "system"
      },
      {
        "content": userQuestion, // 将用户问题作为参数传入
        "role": "user"
      }
    ],
    "model": "deepseek-chat",
    "frequency_penalty": 0,
    "max_tokens": 2048,
    "presence_penalty": 0,
    "response_format": {
      "type": "text"
    },
    "stop": null,
    "stream": false,
    "stream_options": null,
    "temperature": 1,
    "top_p": 1,
    "tools": null, 
    "tool_choice": "none",
    "logprobs": false,
    "top_logprobs": null
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.deepseek.com/chat/completions',
    headers: { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json', 
      'Authorization': 'Bearer sk-b07cb6936f3b40289ef7e0090266a69b'
    },
    data : data
  };

  try {
    const response = await axios(config);
    return response.data.choices[0].message.content; // 直接返回响应字符串
  } catch (error) {
    console.error(error);
    return ""; // 错误时返回空字符串
  }
}