import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const chatData = {
      userId,
      messages: [
        {
          role: "system",
          content: "Chat started",
          timestamp: Date.now(),
        },
      ],
      name: "New Chat",
    };

    // Connect to the database and create a new chat
    await connectDB();
    const chat = await Chat.create(chatData);

    // ✅ Return the saved chat object with _id
    return NextResponse.json({
      success: true,
      message: "Chat created",
      chat,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
