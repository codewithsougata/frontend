'use client';
import { assets } from "@/assets/assets";
import { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import PromptBox from "@/components/PromptBox";
import Message from "@/components/Message";


export default function Home() {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1f1f25] via-[#2a2d33] to-[#1a1c20] text-white">
      {/* Sidebar */}
      <Sidebar expand={expanded} setExpand={setExpanded} />

      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-6 relative">
        
        {/* Mobile Topbar */}
        <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
          <Image
            onClick={() => setExpanded(!expanded)}
            className={`cursor-pointer transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            src={assets.menu_icon}
            alt="menu"
          />
          <Image
            className="opacity-70 hover:opacity-100 transition"
            src={assets.chat_icon}
            alt="chat"
          />
        </div>

        {/* Empty State (Welcome Card) */}
        {messages.length === 0 ? (
          <div className="text-center max-w-md p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 animate-fadeIn">
            <div className="flex items-center justify-center gap-3">
              <Image src={assets.logo_icon} alt="logo" className="h-12 w-12 drop-shadow-lg" />
              <h1 className="text-3xl font-semibold tracking-wide">Hi, I'm <span className="text-blue-400">DeepVision</span></h1>
            </div>
            <p className="text-gray-300 mt-3 text-base">Your AI assistant, ready to chat with you.</p>
            <p className="text-sm mt-6 text-gray-400">Ask me anything to get started 🚀</p>
          </div>
        ) : (
          <div>
            <Message role='user' content='What is nextjs'/>
          </div>
        )}

        <PromptBox isLoading={loading} setIsLoading={setLoading} />

        <p className="text-xs absolute bottom-2 text-gray-500 tracking-wide">
          AI-Generated • For reference only
        </p>
      </div>
    </div>
  );
}
