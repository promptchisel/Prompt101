/**
 * Case: Code Generation
 * @file Driven by LLM, dynamically generates and executes code.
 * @author promptchisel, milesbennett076@gmail.com
 * @version 1.0.0
 * @license
 * Copyright (c) 2025 promptchisel, milesbennett076@gmail.com. All rights reserved.
 * SPDX-License-Identifier: MIT
 */

import axios from 'axios';
import { NodeVM } from 'vm2';  // Use NodeVM instead of VM
import { getAIResponse } from './Prompts_tool.js';

/**
 * Main function - Retrieves and processes AI-generated JSON responses
 * @async
 * @function main
 * @returns {Promise<Object>} Parsed user data object
 * @throws {Error} Errors encountered during processing
 */
async function main() {
    const APIExampleStr = `
async function getLosAngelesWeather() {
    const city = 'Los Angeles';
    const API_KEY = '855337f7beec8117b292ccc90a2a384e';
    const url = \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${API_KEY}&units=metric\`;
    
    try {
        const response = await axios.get(url);
        return \`Current Temperature: \${response.data.main.temp}°C
Weather Condition: \${response.data.weather[0].description}\`;
    } catch (error) {
        throw new Error(\`Failed to retrieve weather: \${error.message}\`);
    }
}

// Directly return the function call result
module.exports = getLosAngelesWeather(); 
`;

    let trimAICodeStr = '';
    try {
        const prompt = `
[API Example: ${APIExampleStr}]
[User Question: Weather in New York, Los Angeles, Chicago, Houston, and Phoenix]
[Output: Please refer to the API example, incorporate the user's question, and write NodeJS code. This code will run in vm2 and can include comments (as comments do not affect execution). The code will be executed later; Print the data in table format. no additional explanations are needed.]
        `;
        const AICodeStr = await getAIResponse(prompt);
        trimAICodeStr = AICodeStr
            .replace(/^```javascript\s*/, '') // Match leading ```javascript and possible newlines
            .replace(/\s*```$/, ''); // Match trailing ``` and possible newlines
        
        // Print the raw response
        console.log("----------------------------code-BEGIN-----------------------------");
        console.log(trimAICodeStr);
        console.log("-----------------------------code-END------------------------------");
    } catch (error) {
        console.error('Error executing code:', error);
    }

    try {
        // Create a restricted virtual machine
        const vm = new NodeVM({
            console: 'inherit',         // Inherit console output
            sandbox: { axios },         // Pass axios instance
            require: {
                external: true,           // Allow external modules
                builtin: ['https', 'url'] // Allow Node.js built-in modules
            },
            wrapper: 'commonjs',        // Use CommonJS wrapper
            eval: false,
            wasm: false,
            sourceExtensions: ['js']
        });

        vm.run(trimAICodeStr, 'weather.js')
            .then(weatherInfo => console.log(weatherInfo))
            .catch(error => console.error(error.message));
    } catch (err) {
        console.error("Blocked 23333:", err);
    }
}

main().catch(console.error);
/** Sample Output:
----------------------------code-BEGIN-----------------------------
async function getWeatherForCities() {
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    const API_KEY = '855337f7beec8117b292ccc90a2a384e';
    const weatherData = [];

    for (const city of cities) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        try {
            const response = await axios.get(url);
            weatherData.push({
                City: city,
                Temperature: `${response.data.main.temp}°C`,
                Condition: response.data.weather[0].description
            });
        } catch (error) {
            weatherData.push({
                City: city,
                Temperature: 'N/A',
                Condition: 'Failed to retrieve data'
            });
        }
    }

    // Print the data in table format
    console.table(weatherData);
}

// Execute the function
module.exports = getWeatherForCities();
-----------------------------code-END------------------------------
┌─────────┬───────────────┬─────────────┬───────────────────┐
│ (index) │ City          │ Temperature │ Condition         │
├─────────┼───────────────┼─────────────┼───────────────────┤
│ 0       │ 'New York'    │ '19.86°C'   │ 'overcast clouds' │
│ 1       │ 'Los Angeles' │ '18.42°C'   │ 'clear sky'       │
│ 2       │ 'Chicago'     │ '26.04°C'   │ 'clear sky'       │
│ 3       │ 'Houston'     │ '26.41°C'   │ 'few clouds'      │
│ 4       │ 'Phoenix'     │ '28.56°C'   │ 'clear sky'       │
└─────────┴───────────────┴─────────────┴───────────────────┘
 */