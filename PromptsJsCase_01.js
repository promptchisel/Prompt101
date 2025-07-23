/**
 * Case: Get AI-generated JSON response
 * @file Demonstrates how to obtain and parse structured JSON data from AI
 * @author promptchisel, milesbennett076@gmail.com
 * @version 1.0.0
 * @license
 * Copyright (c) 2025 promptchisel, milesbennett076@gmail.com. All rights reserved.
 * SPDX-License-Identifier: MIT
 */

import { getAIResponse } from './Prompts_tool.js';

/**
 * Main function - Get and process AI-generated JSON response
 * @async
 * @function main
 * @returns {Promise<Object>} Parsed user data object
 * @throws {Error} Errors occurred during processing
 */
async function main() {
  try {
    const prompt = `
      My classmate is Alice, she is 18 years old.
      Please return a JSON object, example JSON structure: 
      { 
        "name": "Miles", 
        "age": 17 
      }
    `;
    const response = await getAIResponse(prompt);
    
    console.log("----------------------------response-BEGIN-----------------------------");
    console.log(response);
    console.log("-----------------------------response-END------------------------------");
    
    const cleanedResponse = response.replace(/```json|```/g, '').trim();
    const person = JSON.parse(cleanedResponse);
    console.log('person object: ', person);
    console.log(`Name: ${person.name}`);
    console.log(`Age: ${person.age}`);
    
    return person;
  } catch (error) {
    console.error('Error processing AI response:', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

// Execute main function
main().catch(console.error);

/**
 * Sample output:
----------------------------response-BEGIN-----------------------------
```json
{
  "name": "Alice",
  "age": 18
}
```
-----------------------------response-END------------------------------
person object:  { name: 'Alice', age: 18 }
Name: Alice
Age: 18
 */