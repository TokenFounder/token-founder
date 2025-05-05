import { createDeepSeek } from '@ai-sdk/deepseek';
import { createOpenAI } from '@ai-sdk/openai';

import { generateText } from 'ai';
import { deployTokenTemplate } from './template.js'

const jsonBlockPattern = /```json\n([\s\S]*?)\n```/;

function parseJSONObjectFromText(
    text
) {
    let jsonData = null;
    const jsonBlockMatch = text.match(jsonBlockPattern);

    if (jsonBlockMatch) {
        text = cleanJsonResponse(text);
        const parsingText = normalizeJsonString(text);
        try {
            jsonData = JSON.parse(parsingText);
        } catch (e) {
            console.error("Error parsing JSON:", e);
            console.error("Text is not JSON", text);
            return extractAttributes(text);
        }
    } else {
        const objectPattern = /{[\s\S]*?}?/;
        const objectMatch = text.match(objectPattern);

        if (objectMatch) {
            text = cleanJsonResponse(text);
            const parsingText = normalizeJsonString(text);
            try {
                jsonData = JSON.parse(parsingText);
            } catch (e) {
                console.error("Error parsing JSON:", e);
                console.error("Text is not JSON", text);
                return extractAttributes(text);
            }
        }
    }

    if (
        typeof jsonData === "object" &&
        jsonData !== null &&
        !Array.isArray(jsonData)
    ) {
        return jsonData;
    } else if (typeof jsonData === "object" && Array.isArray(jsonData)) {
        return parseJsonArrayFromText(text);
    } else {
        return null;
    }
}


function cleanJsonResponse(response) {
    return response
        .replace(/```json\s*/g, "") // Remove ```json
        .replace(/```\s*/g, "") // Remove any remaining ```
        .replace(/(\r\n|\n|\r)/g, "") // Remove line breaks
        .trim();
}

const normalizeJsonString = (str) => {
    // Remove extra spaces after '{' and before '}'
    str = str.replace(/\{\s+/, '{').replace(/\s+\}/, '}').trim();

    // "key": unquotedValue → "key": "unquotedValue"
    str = str.replace(
      /("[\w\d_-]+")\s*: \s*(?!"|\[)([\s\S]+?)(?=(,\s*"|\}$))/g,
      '$1: "$2"',
    );

    // "key": 'value' → "key": "value"
    str = str.replace(
      /"([^"]+)"\s*:\s*'([^']*)'/g,
      (_, key, value) => `"${key}": "${value}"`,
    );

    // "key": someWord → "key": "someWord"
    str = str.replace(/("[\w\d_-]+")\s*:\s*([A-Za-z_]+)(?!["\w])/g, '$1: "$2"');

    // Replace adjacent quote pairs with a single double quote
    str = str.replace(/(?:"')|(?:'")/g, '"');
    return str;
};

export default async function generateObject(text) {
    let provider;
    let parseResult;
    let apiKey;
    if (process.env.OPENAI_API_KEY) {
        provider = "openai";
        apiKey = process.env.OPENAI_API_KEY;
    } else if (process.env.DEEPSEEK_API_KEY) {
        provider = "deepseek";
        apiKey = process.env.DEEPSEEK_API_KEY;
    } else {
        console.log("No API key found for OpenAI or DeepSeek. Please set one in your environment variables.");
        return;
    }

    switch (provider) {
        case "openai":
            const openai = createOpenAI({
                apiKey,
              });
              
            // const recentMessages = "Hi @TokenFounder, I want deploy a new token called TokenFounder, symbol called TFT, decimals is 9, with the initial holder being 0x67e2c2e6186ae9Cc17798b5bD0c3c36Ef0209aC9, with an initial supply of 100000000 on Base Network.";
            
            const renderedTemplateOpenai = deployTokenTemplate.replace('{{recentMessages}}', text);
            
            console.log(`renderedTemplateOpenai: ${renderedTemplateOpenai}`)
            
            const { generateTextOpenai } = await generateText({
                model: openai(process.env.OPENAI_MODEL ?? 'o3-mini'),
                prompt: renderedTemplateOpenai,
            });
                
            console.log(`generateTextOpenai: ${generateTextOpenai}`);
        
            parseResult = parseJSONObjectFromText(generateTextOpenai)
            console.log(`parseResult: ${parseResult}`);
            break;
        case "deepseek":
            const deepseek = createDeepSeek({
                apiKey,
              });
              
            // const recentMessages = "Hi @TokenFounder, I want deploy a new token called TokenFounder, symbol called TFT, decimals is 9, with the initial holder being 0x67e2c2e6186ae9Cc17798b5bD0c3c36Ef0209aC9, with an initial supply of 100000000 on Base Network.";
            
            const renderedTemplateDeepseek = deployTokenTemplate.replace('{{recentMessages}}', text);
            
            console.log(`renderedTemplateDeepseek: ${renderedTemplateDeepseek}`)
            
            const { generateTextDeepseek } = await generateText({
                model: deepseek(process.env.DEEPSEEK_MODEL ?? 'deepseek-chat'),
                prompt: renderedTemplateDeepseek,
            });
                
            console.log(`generateText: ${generateTextDeepseek}`);
        
            parseResult = parseJSONObjectFromText(generateTextDeepseek)
            console.log(`parseResult: ${parseResult}`);
            break;
        default:
          console.log('Unsupported provider');
    }

    return parseResult;
}
