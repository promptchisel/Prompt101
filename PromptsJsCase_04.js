/**
 * Case: Return timestamps based on user questions
 * @file Users may query data based on seasons or time periods
 * @author promptchisel, milesbennett076@gmail.com
 * @version 1.0.0
 * @license
 * Copyright (c) 2025 promptchisel, milesbennett076@gmail.com. All rights reserved.
 * SPDX-License-Identifier: MIT
 */


import { getAIResponse } from './Prompts_tool.js';

function getSeasonTimestamps() {
    const now = new Date();
    const year = now.getFullYear();
    
    const createDate = (y, m, d) => new Date(y, m, d);
    const springStart = createDate(year, 2 - 1, 3);
    const summerStart = createDate(year, 5 - 1, 5);
    const autumnStart = createDate(year, 8 - 1, 7);
    
    const winterYear = now < springStart ? year - 1 : year;
    const winterStart = createDate(winterYear, 11 - 1, 7);

    return {
        spring: springStart.getTime() / 1000,
        summer: summerStart.getTime() / 1000,
        autumn: autumnStart.getTime() / 1000,
        winter: winterStart.getTime() / 1000
    };
}

// Centralized date information processing
const dateInfo = {
    now: new Date(),
    get year() { return this.now.getFullYear() },
    get month() { return this.now.getMonth() + 1 },
    get day() { return this.now.getDate() },
    get timeStr() { 
        return `${this.year}-${String(this.month).padStart(2, '0')}-${String(this.day).padStart(2, '0')}`;
    }
};

const { spring, summer, autumn, winter } = getSeasonTimestamps();
const seasonStr = `Spring start timestamp: ${spring}, Summer start timestamp: ${summer}, Autumn start timestamp: ${autumn}, Winter start timestamp: ${winter}`;
console.log(seasonStr);

const testCases = [
    'Hot notes from the last three weeks',
    'Hot notes from the last six months', 
    'Hot notes since this summer'
];

// Optimized template string format
// [USER-QUESTION: Hot notes from the last three months.]

testCases.forEach(async(testCase) => {
const response = await getAIResponse(`[TODAY_TIME:
  timestamp: ${Math.floor(Date.now() / 1000)} (seconds),
  timeStr: ${dateInfo.timeStr},
  seasonStr: ${seasonStr}
]
[USER-QUESTION: ${testCase}]
[OUTPUT: Please calculate the timestamp according to the following requirements and show the complete calculation process
  a. If the user's question is related to seasons, directly use the data in seasonStr.
  b. If the user's question is not related to seasons, calculate the time by subtracting the time period from the current time.
  The last line should output the timestamp (in seconds) separately.Do not use the markdown syntax.
]`).then(response => {
        // Unified log format
        const logBorder = '----------------------------';
        console.log(`${logBorder} begin ${logBorder}`);
        console.log(`Current date: ${dateInfo.timeStr}`);
        console.log(response);
        const timestamp = response.split('\n').pop().trim();
        console.log(`Parsing result: ${timestamp}`);
        console.log(`${logBorder}  end  ${logBorder}`);
    });
});
/** Sample Output:
Spring start timestamp: 1738512000, Summer start timestamp: 1746374400, Autumn start timestamp: 1754496000, Winter start timestamp: 1762444800
---------------------------- begin ----------------------------
Current date: 2025-07-24
To determine the timestamp for "Hot notes since this summer," we will follow these steps:

1. The user's question is related to seasons ("since this summer"), so we will use the data in seasonStr.
2. From seasonStr, the Summer start timestamp is 1746374400.

The timestamp for "since this summer" is therefore the Summer start timestamp.

1746374400
Parsing result: 1746374400
----------------------------  end  ----------------------------
---------------------------- begin ----------------------------
Current date: 2025-07-24
The user's question is "Hot notes from the last three weeks," which is not related to seasons. Therefore, we will calculate the time by subtracting the time period from the current time.

1. Current timestamp: 1753343325 seconds
2. Three weeks in seconds: 3 weeks * 7 days/week * 24 hours/day * 60 minutes/hour * 60 seconds/minute = 1814400 seconds
3. Timestamp for "last three weeks": 1753343325 - 1814400 = 1751528925

1751528925
Parsing result: 1751528925
----------------------------  end  ----------------------------
---------------------------- begin ----------------------------
Current date: 2025-07-24
To determine the timestamp for "Hot notes from the last six months," we will calculate the time by subtracting the time period from the current time since the question is not related to seasons.

1. Current timestamp: 1753343325 seconds (2025-07-24)
2. Six months in seconds: 6 months * 30 days/month * 24 hours/day * 60 minutes/hour * 60 seconds/minute = 15552000 seconds
3. Subtract six months from current time: 1753343325 - 15552000 = 1737791325

1737791325
Parsing result: 1737791325
----------------------------  end  ----------------------------
 */