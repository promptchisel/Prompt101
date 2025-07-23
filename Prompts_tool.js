import axios from 'axios';

// 新增异步函数
// 提取API配置常量
const API_URL = 'https://api.deepseek.com/chat/completions';
const API_KEY = 'Bearer sk-b07cb6936f3b40289ef7e0090266a69b';

export async function getAIResponse(userQuestion) {
  // 拆分请求数据配置
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
    // 保持默认值的参数使用展开式写法
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

  // 配置对象结构化
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
    // 增强错误处理
    console.error('API请求失败:', error.response?.data || error.message);
    return ""; 
  }
}