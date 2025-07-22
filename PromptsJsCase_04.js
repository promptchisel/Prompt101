/**
 * 案例：根据用户问题返回时间戳
 * @file 用户可能会根据季节查询数据，也可能会根据时间查询数据
 * @author promptchisel
 * @version 1.0.0
 * @license MIT
 */

import { getAIResponse } from './Prompts_tool.js';

function getSeasonTimestamps() {
    const now = new Date();
    const year = now.getFullYear();
    
    // 使用解构赋值简化日期创建
    const createDate = (y, m, d) => new Date(y, m, d);
    const springStart = createDate(year, 2, 3);
    const summerStart = createDate(year, 5, 5);
    const autumnStart = createDate(year, 8, 7);
    
    // 简化冬季判断逻辑
    const winterYear = now < springStart ? year - 1 : year;
    const winterStart = createDate(winterYear, 11, 7);

    return {
        spring: springStart.getTime() / 1000,
        summer: summerStart.getTime() / 1000,
        autumn: autumnStart.getTime() / 1000,
        winter: winterStart.getTime() / 1000
    };
}

// 集中处理日期信息
const dateInfo = {
    now: new Date(),
    get year() { return this.now.getFullYear() },
    get month() { return this.now.getMonth() + 1 },
    get day() { return this.now.getDate() },
    get timeStr() { 
        return `${this.year}-${String(this.month).padStart(2, '0')}-${String(this.day).padStart(2, '0')}`;
    }
};

// 使用解构获取季节时间戳
const { spring, summer, autumn, winter } = getSeasonTimestamps();
const seasonStr = `春季开始时间戳: ${spring}, 夏季开始时间戳: ${summer}, 秋季开始时间戳: ${autumn}, 冬季开始时间戳: ${winter}`;

// 优化模板字符串格式
// [USER-QUESTION: 最近三个月内的热门笔记.]

getAIResponse(`[TODAY_TIME:
  timestamp: ${Math.floor(Date.now() / 1000)} (秒),
  timeStr: ${dateInfo.timeStr},
  seasonStr: ${seasonStr}
]
[USER-QUESTION: 最近半年内的热门笔记.]
[OUTPUT:请你按下下面要求计算时间戳，展示完整计算过程
  a. 如果用户问题和季节相关，直接使用 seasonStr 中的数据。
  b. 如果用户问题不涉及季节，时间计算使用当前时间减去时间段
  最后一行单独输出时间戳（单位秒）
]`).then(response => {
    // 统一日志格式
    const logBorder = '----------------------------';
    console.log(`${logBorder} begin ${logBorder}`);
    console.log(`当前日期: ${dateInfo.timeStr}`);
    console.log(response);
    const timestamp = response.split('\n').pop().trim();
    console.log(`解析结果: ${timestamp}`);
    console.log(`${logBorder} end ${logBorder.replace('begin', 'end')}`);
});