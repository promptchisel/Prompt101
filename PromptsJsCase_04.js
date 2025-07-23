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
    const springStart = createDate(year, 2 - 1, 3);
    const summerStart = createDate(year, 5 - 1, 5);
    const autumnStart = createDate(year, 8 - 1, 7);
    
    // 简化冬季判断逻辑
    const winterYear = now < springStart ? year - 1 : year;
    const winterStart = createDate(winterYear, 11 - 1, 7);

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
console.log(seasonStr);

const testCases = [
    '最近三周的热门笔记',
    '最近半年的热门笔记', 
    '今年夏天以来的热门笔记'
];

// 优化模板字符串格式
// [USER-QUESTION: 最近三个月内的热门笔记.]

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
]`).then(response => {
        // 统一日志格式
        const logBorder = '----------------------------';
        console.log(`${logBorder} begin ${logBorder}`);
        console.log(`当前日期: ${dateInfo.timeStr}`);
        console.log(response);
        const timestamp = response.split('\n').pop().trim();
        console.log(`解析结果: ${timestamp}`);
        console.log(`${logBorder}  end  ${logBorder}`);
    });
});
/**
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
----------------------------  end  ----------------------------
---------------------------- begin ----------------------------
当前日期: 2025-07-23
用户问题为"最近半年的热门笔记"，不涉及季节相关，因此按照当前时间减去时间段来计算。

计算过程：
1. 当前时间戳：1753234510 秒
2. 半年时间 ≈ 6 个月 × 30 天/月 × 24 小时/天 × 3600 秒/小时 = 15552000 秒
3. 最近半年的时间戳 = 当前时间戳 - 半年时间 = 1753234510 - 15552000 = 1737682510 秒

时间戳（单位秒）：
1737682510
解析结果: 1737682510
----------------------------  end  ----------------------------
---------------------------- begin ----------------------------
当前日期: 2025-07-23
根据用户问题“今年夏天以来的热门笔记”，问题与季节相关，因此直接使用 seasonStr 中的夏季开始时间戳。

夏季开始时间戳: 1746374400

时间戳（单位秒）: 1746374400
解析结果: 时间戳（单位秒）: 1746374400
----------------------------  end  ----------------------------
 */