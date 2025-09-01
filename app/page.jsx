"use client";
import { assets } from "@/assets/assets";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import PromptBox from "@/components/PromptBox";
import Message from "@/components/Message";
import { useAppContext } from "@/context/AppContext";

export default function Home() {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedChat } = useAppContext();
  const containerRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-cyan-950 via-indigo-950/30 to-purple-950/20 text-black overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-gradient-to-br from-indigo-500/15 to-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 rounded-full blur-3xl animate-float-slow"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      {/* Sidebar */}
      <Sidebar expand={expanded} setExpand={setExpanded} />

      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6 relative">
        {/* Mobile Topbar */}
        <div className="md:hidden absolute px-6 top-6 flex items-center justify-between w-full z-30">
          <button
            onClick={() => setExpanded(!expanded)}
            className="group p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-cyan-500/20 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 shadow-lg"
          >
            <Image
              className={`transition-all duration-500 group-hover:scale-110 ${
                expanded ? "rotate-180" : ""
              }`}
              src={assets.menu_icon}
              alt="menu"
              width={20}
              height={20}
            />
          </button>
          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-cyan-500/20 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 shadow-lg">
            <Image
              className="opacity-70 hover:opacity-100 transition-opacity duration-300"
              src={assets.chat_icon}
              alt="chat"
              width={20}
              height={20}
            />
          </div>
        </div>

        {/* Empty State (Welcome Card) */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in max-w-4xl mx-auto px-4">
            {/* Main Welcome Section */}
            <div className="flex flex-col items-center space-y-6">
              {/* Logo */}
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700 animate-pulse-slow"></div>
                <div className="relative p-6 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-cyan-500/20 shadow-2xl group-hover:shadow-cyan-500/20 transition-all duration-500">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Image
                    src={assets.logo_icon}
                    alt="DeepVision Logo"
                    className="h-16 w-16 relative z-10 drop-shadow-2xl animate-float group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Welcome Text */}
              <div className="text-center space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 bg-clip-text text-transparent animate-gradient leading-tight">
                  Hi, I'm DeepVision
                </h1>
                <div className="space-y-2">
                  <p className="text-xl text-cyan-200 font-light">
                    Your AI-powered creative companion
                  </p>
                  <p className="text-lg text-blue-200/80">
                    How can I help you today?
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {[
                {
                  icon: "💡",
                  title: "Creative Ideas",
                  desc: "Generate innovative solutions and creative content",
                  gradient: "from-yellow-400/20 to-orange-400/20",
                  border: "border-yellow-400/30",
                },
                {
                  icon: "📊",
                  title: "Data Analysis",
                  desc: "Analyze complex data and create visualizations",
                  gradient: "from-cyan-400/20 to-blue-400/20",
                  border: "border-cyan-400/30",
                },
                {
                  icon: "🔍",
                  title: "Deep Insights",
                  desc: "Discover patterns and extract meaningful insights",
                  gradient: "from-purple-400/20 to-pink-400/20",
                  border: "border-purple-400/30",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl border border-white/10 hover:${feature.border} transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer shadow-lg hover:shadow-2xl`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500 filter drop-shadow-lg">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-white mb-2 text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-200 group-hover:to-blue-200 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-cyan-200/70 group-hover:text-cyan-100 transition-colors duration-300 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              {["Ask a question", "Write code", "Analyze data", "Creative writing"].map(
                (action, index) => (
                  <button
                    key={index}
                    className="px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-400/40 hover:bg-white/10 transition-all duration-300 text-sm font-medium text-cyan-200 hover:text-white group"
                  >
                    <span className="group-hover:scale-105 transition-transform duration-300 inline-block">
                      {action}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto scrollbar-hide"
          >
            {/* Chat Header */}
            <div className="fixed top-8 z-20 px-6 py-3 rounded-2xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-cyan-500/20 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse shadow-lg shadow-green-400/50"></div>
                <p className="font-semibold text-transparent bg-gradient-to-r from-cyan-300 via-white to-blue-300 bg-clip-text">
                  {selectedChat?.name || "DeepVision Chat"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="w-full max-w-5xl space-y-8 pt-20 pb-8 px-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="animate-slide-up opacity-0"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  <Message role={msg.role} content={msg.content} />
                </div>
              ))}

              {/* Loading Animation */}
              {isLoading && (
                <div className="flex gap-6 max-w-4xl w-full py-8 animate-fade-in">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 rounded-full blur-lg animate-pulse"></div>
                    <div className="relative p-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-cyan-500/20 shadow-xl">
                      <Image
                        className="h-8 w-8 animate-spin-slow opacity-90"
                        src={assets.logo_icon}
                        alt="Logo"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-white/5 via-white/2 to-white/5 backdrop-blur-xl border border-cyan-500/20 shadow-lg">
                    <div className="flex space-x-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-bounce shadow-lg"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                    <span className="text-cyan-200 font-medium">
                      DeepVision is thinking...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prompt Box */}
        <div className="w-full max-w-4xl relative z-20 px-4">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
            <div className="relative">
              <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 text-center">
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-cyan-500/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse shadow-sm shadow-green-400/50"></div>
              <span className="text-xs text-cyan-200 font-medium">
                AI-Generated
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
            <span className="text-xs text-blue-500">For reference only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
