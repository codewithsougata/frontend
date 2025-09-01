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

    const { chatId, name } = await req.json();

    if (!chatId || !name) {
      return NextResponse.json({
        success: false,
        message: "Chat ID and new name are required",
      });
    }

    await connectDB();

    // ✅ Find and update chat
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { name },
      { new: true } // return updated document
    );

    if (!updatedChat) {
      return NextResponse.json({
        success: false,
        message: "Chat not found or you don't have permission",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Chat renamed successfully",
      chat: updatedChat, // ✅ send back updated chat
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
