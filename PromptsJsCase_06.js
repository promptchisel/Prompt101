/**
 * 案例：代码生成
 * @file 使用 LLM 驱动，动态生成代码，并动态执行。
 * @author promptchisel
 * @version 1.0.0      
 * @license MIT
 */

import axios from 'axios';
import { NodeVM } from 'vm2';  // 改用 NodeVM 替代 VM
import { getAIResponse } from './Prompts_tool.js';

/**
 * 主函数 - 获取并处理AI生成的JSON响应
 * @async
 * @function main
 * @returns {Promise<Object>} 解析后的用户数据对象
 * @throws {Error} 处理过程中发生的错误
 */
async function main() {
    const APIExampleStr = `
async function getLosAngelesWeather() {
    const city = 'Los Angeles';
    const API_KEY = '855337f7beec8117b292ccc90a2a384e';
    const url = \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${API_KEY}&units=metric\`;
    
    try {
        const response = await axios.get(url);
        return \`当前温度: \${response.data.main.temp}°C
天气状况: \${response.data.weather[0].description}\`;
    } catch (error) {
        throw new Error(\`获取天气失败: \${error.message}\`);
    }
}

// 直接返回函数调用结果
module.exports = getLosAngelesWeather(); 
`;

    let trimAICodeStr = '';
    try {
        const prompt = `
[API示例: ${APIExampleStr}]
[用户问题：纽约、洛杉矶、芝加哥、​​休斯敦​​、菲尼克斯的天气]
[输出：请参考API示例，集合用户问题，使用 NodeJS 编程。这个代码是要在 vm2 中运行的，代码里面可以有注释,因为注释不影响运行。后面会执行代码，不要做额外解释]
        `;
        const AICodeStr = await getAIResponse(prompt);
        trimAICodeStr = AICodeStr
            .replace(/^```javascript\s*/, '') // 匹配开头的```javascript和可能的换行
            .replace(/\s*```$/, ''); // 匹配结尾的```和可能的换行
        
        // 打印原始响应
        console.log("----------------------------code-BEGIN-----------------------------");
        console.log(trimAICodeStr);
        console.log("-----------------------------code-END------------------------------");
    } catch (error) {
        console.error('执行代码时出错:', error);
    }

    try {
        // 创建带限制的虚拟机
        const vm = new NodeVM({
            console: 'inherit',         // 继承控制台输出
            sandbox: { axios },         // 传入 axios 实例
            require: {
                external: true,           // 允许引入外部模块
                builtin: ['https', 'url'] // 允许 Node.js 内置模块
            },
            wrapper: 'commonjs',        // 使用 CommonJS 包装
            eval: false,
            wasm: false,
            sourceExtensions: ['js']
        });

        vm.run(trimAICodeStr, 'weather.js')
            .then(weatherInfo => console.log(weatherInfo))
            .catch(error => console.error(error.message));
    } catch (err) {
        console.error("被阻止23333:", err);
    }
}

main().catch(console.error);
/** 示例输出：
----------------------------code-BEGIN-----------------------------
async function getMultiCityWeather() {
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
  const API_KEY = '855337f7beec8117b292ccc90a2a384e';
  let results = [];

  for (const city of cities) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    
    try {
      const response = await axios.get(url);
      results.push({
        city: city,
        temp: `${response.data.main.temp}°C`,
        description: response.data.weather[0].description
      });
    } catch (error) {
      results.push({
        city: city,
        error: `获取天气失败: ${error.message}`
      });
    }
  }

  // 格式化输出结果
  let output = '';
  results.forEach(result => {
    if (result.error) {
      output += `${result.city}: ${result.error}\n`;
    } else {
      output += `${result.city} - 当前温度: ${result.temp}, 天气状况: ${result.description}\n`;
    }
  });
  
  return output;
}

// 直接返回函数调用结果
module.exports = getMultiCityWeather();
-----------------------------code-END------------------------------
New York - 当前温度: 18.4°C, 天气状况: scattered clouds
Los Angeles - 当前温度: 18.38°C, 天气状况: clear sky
Chicago - 当前温度: 21.47°C, 天气状况: broken clouds
Houston - 当前温度: 25.1°C, 天气状况: clear sky
Phoenix - 当前温度: 29.17°C, 天气状况: broken clouds
 */