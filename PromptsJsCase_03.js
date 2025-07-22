import axios from 'axios';
import { getAIResponse } from './Prompts_tool.js';

const currentTimestampS = Date.now() / 1000;

// 比如查询某个时间点以来热门笔记，关键是获取时间戳。
// 1. 最近三周内的热门笔记，最近三个月内的热门笔记。
// getAIResponse(`[TODAY_TIME:${currentTimestampS}(单位是秒)]
//   [USER-QUESTION: 最近三周内的热门笔记]
//   [OUTPUT: 在当前逻辑中只要返回时间戳即可。为了计算准确，请你给出来计算过程。最后一行给出时间戳,单位是秒。]`).then(response => {
//   console.log("----------------------------begin-----------------------------");
//   console.log(response);
//   const timestamp = response.split('\n').pop().trim();  // 分割文本并取最后一行
//   console.log(`Timestamp: ${timestamp}`);
//   console.log("-----------------------------end------------------------------");
// });
/**
----------------------------begin-----------------------------
要计算最近三周内的时间戳，我们需要从当前时间戳减去三周的秒数。

1. 当前时间戳（给定）: 1753090335.555 秒
2. 三周的秒数计算:
   - 1周 = 7天
   - 1天 = 24小时
   - 1小时 = 3600秒
   - 因此，三周 = 3 × 7 × 24 × 3600 = 1814400 秒

3. 最近三周的时间戳计算:
   - 最近三周的时间戳 = 当前时间戳 - 三周的秒数
   - 最近三周的时间戳 = 1753090335.555 - 1814400 = 1751275935.555 秒

最后的时间戳（取整数部分，单位是秒）:
1751275935
Timestamp: 1751275935
-----------------------------end------------------------------
 */

function getSeasonTimestamps() {
    const now = new Date();
    const year = now.getFullYear();
    
    // 定义四个季节的开始日期（月份0-based：0=1月, 1=2月...）
    const springStart = new Date(year, 1, 3);    // 2月3日
    const summerStart = new Date(year, 4, 5);    // 5月5日
    const autumnStart = new Date(year, 7, 7);    // 8月7日
    let winterStart;
    
    // 判断冬季特殊情况：若当前时间在2月3日前，则冬季开始于上一年11月7日
    if (now < springStart) {
        winterStart = new Date(year - 1, 10, 7); // 上一年11月7日
    } else {
        winterStart = new Date(year, 10, 7);     // 本年11月7日
    }
    
    // 返回时间戳（毫秒）
    return {
        spring: springStart.getTime() / 1000,
        summer: summerStart.getTime() / 1000,
        autumn: autumnStart.getTime() / 1000,
        winter: winterStart.getTime() / 1000
    };
}

const now = new Date();
const year = now.getFullYear();  // 获取年份（4位数）
const month = now.getMonth() + 1; // 获取月份（0-11，需要+1）
const day = now.getDate();       // 获取日期（1-31）
const timeStr = `${year}-${month}-${day}`;
console.log(`timeStr: ${timeStr}`);

const seasons = getSeasonTimestamps();
const seasonStr = `春季开始时间戳:, ${seasons.spring}, 夏季开始时间戳:, ${seasons.summer}, 秋季开始时间戳:, ${seasons.autumn}, 冬季开始时间戳:, ${seasons.winter}`;
// 2. 查询春夏秋冬的时间戳
getAIResponse(`[TODAY_TIME:${currentTimestampS}(单位是秒), ${timeStr},  :${seasonStr}]
  [USER-QUESTION: 查询今年夏天以来的热门笔记。]
  [OUTPUT: 在当前逻辑中只要返回时间戳即可。为了计算准确，请你给出来计算过程。最后一行给出时间戳,单位是秒。]`).then(response => {
  console.log("----------------------------begin-----------------------------");
  console.log(response);
  const timestamp = response.split('\n').pop().trim();  // 分割文本并取最后一行
  console.log(`Timestamp: ${timestamp}`);
  console.log("-----------------------------end------------------------------");
});