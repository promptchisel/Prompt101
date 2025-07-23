/**
 * Case: Generate Radar Chart
 * @file Generate radar chart data based on candidate's interview performance
 * @author promptchisel, milesbennett076@gmail.com
 * @version 1.0.0
 * @license
 * Copyright (c) 2025 promptchisel, milesbennett076@gmail.com. All rights reserved.
 * SPDX-License-Identifier: MIT
 */


import { getAIResponse } from './Prompts_tool.js';

// Candidate data example
const candidateA = `The candidate has a solid performance in programming fundamentals, demonstrating proficiency in using data structures and algorithms to solve problems with clear and standardized code style. In the system design section, they showed good architectural thinking, able to weigh the pros and cons of different solutions and propose scalable design plans. The candidate's problem-solving ability is outstanding, quickly identifying core issues when facing complex requirements and providing efficient solutions. They have rich engineering practice experience, familiar with code optimization, testing, and debugging techniques, with a strong awareness of code quality. Additionally, the candidate has strong collaboration ability, with clear communication skills, and can effectively participate in technical discussions and integrate into team development processes.`; 

// Core processing function
async function generateRadarData() {
    try {
        const response = await getAIResponse(
            `[Interview Information:${candidateA}][Output description: Please return a JSON structure containing the following 5 fields based on the above information: collaboration ability, problem-solving ability, system design, engineering practice, programming fundamentals. Structure example: {
    "collaboration": 8,
    "problem_solving": 9,
    "system_design": 8,
    "engineering_practice": 7,
    "programming_fundamentals": 9
  }`
            );

        const parsedData = parseResponseData(response);
        logRadarData(parsedData);
        return parsedData;
    } catch (error) {
        console.error('Data processing failed:', error.message);
        throw error;
    }
}

// Data processing function
function parseResponseData(response) {
    try {
        const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedResponse);
    } catch (error) {
        throw new Error(`JSON parsing failed: ${error.message}`);
    }
}

// Data output formatting
function logRadarData(data) {
    const separator = '----------------------------';
    console.log(`${separator} begin ${separator}`);
    
    console.log('Candidate evaluation data:');
    Object.entries(data).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
    });
    
    console.log(`${separator}  end  ${separator}\n`);
}
    
// Execute main function
generateRadarData()
    .then(() => console.log('Radar chart data generation completed'))
    .catch(error => console.error('Process exception:', error.message));

/** Sample Output:
---------------------------- begin ----------------------------
Candidate evaluation data:
collaboration: 9
problem_solving: 9
system_design: 8
engineering_practice: 8
programming_fundamentals: 9
----------------------------  end  ----------------------------
*/