export const maxDuration = 60;
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import Chat from "@/models/Chat";
import connectDB from "@/config/db";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1", // ✅ Free via OpenRouter
  apiKey: process.env.DEEPSEEK_API_KEY,  // ✅ Use OpenRouter key
  defaultHeaders: {
    "HTTP-Referer": "frontend-oafk454br-sougata-mannas-projects.vercel.app", // Or your deployed site
    "X-Title": "My Next.js AI App",
  },
});

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { chatId, prompt } = await req.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }

    await connectDB();
    const data = await Chat.findOne({ _id: chatId, userId });

    if (!data) {
      return NextResponse.json({ success: false, message: "Chat not found" });
    }

    // Create a user message
    const userPrompt = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };
    data.messages.push(userPrompt);

    // ✅ Call DeepSeek (free via OpenRouter)
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free", // ✅ correct model
      messages: data.messages.map((m) => ({
        role: m.role,
        content: m.content || "",
      })),
    });

    // Extract assistant reply
    const message = {
      role: completion.choices[0].message.role,
      content: completion.choices[0].message.content || "",
      timestamp: Date.now(),
    };

    data.messages.push(message);
    await data.save();

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("❌ DeepSeek Error:", error.response?.data || error.message);
    return NextResponse.json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
}
