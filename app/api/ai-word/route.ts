import axios from "axios";
import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
const API_URL = "https://api.deepseek.com/v1/chat/completions";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();
        console.log(API_URL);

        const response = await axios.post(API_URL, {
            model: "deepseek-chat",
            messages: [
                {
                    role: "user",
                    content: "请从以下内容中提取或生成10个中文和英文单词对。返回的数据格式必须是一个包含id、chinese和english字段的JSON数组。示例：[{\"id\": 1, \"chinese\": \"苹果\", \"english\": \"apple\"}, {\"id\": 2, \"chinese\": \"书\", \"english\": \"book\"}]。如果提供的内容中没有足够的单词，请创造性地补充相关单词以达到10对。确保返回的是有效的JSON格式数组，不要包含其他文本。"
                },
                {
                    role: "assistant",
                    content: "我会根据您提供的内容生成10个中英文单词对，并以指定的JSON格式返回。"
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1000,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            timeout: 15000,
        });

        const assistantResponse = response.data?.choices[0]?.message?.content || "";
        console.log("Assistant response:", assistantResponse);
        // 尝试直接解析响应内容
        try {
            const wordPairs = JSON.parse(assistantResponse);
            return NextResponse.json(wordPairs);
        } catch (e) {
            // 如果直接解析失败，尝试提取JSON部分
            const jsonMatch = assistantResponse.match(/\[\s*{[\s\S]*}\s*\]/) || assistantResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) {
                const jsonContent = jsonMatch[1] ? jsonMatch[1].trim() : jsonMatch[0].trim();
                return NextResponse.json(JSON.parse(jsonContent));
            } else {
                throw new Error("Could not extract valid JSON from response");
            }
        }
    } catch (error: any) {
        console.error("DeepSeek API Error:", error.response?.data || error.message);
        return NextResponse.json({ error: error.response?.data || "Failed to fetch AI response" }, { status: 500 });
    }
}