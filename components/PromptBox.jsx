import React, { useState, useRef, useEffect } from "react";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";

const PromptBox = ({ isLoading, setIsLoading }) => {
  const [prompt, setPrompt] = useState(""); 
  const textareaRef = useRef(null);
  const {
    user,
    createNewChat,
    fetchUserChats,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
  } = useAppContext();

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [prompt]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const sendPrompt = async (e) => {
    const promptCopy = prompt;
    try {
      e.preventDefault();
      if (!user) return toast.error("Login to send message");
      if (isLoading) return toast.error("Wait for the previous prompt response");

      setIsLoading(true);
      setPrompt("");

      const userPrompt = {
        role: "user",
        content: promptCopy,
        timestamp: Date.now(),
      };

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, messages: [...chat.messages, userPrompt] }
            : chat
        )
      );

      // ✅ Update selected chat state
      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, userPrompt],
      }));

      // ✅ Send request to backend
      const { data } = await axios.post("/api/chat/ai", {
        chatId: selectedChat._id,
        prompt: promptCopy,
      });

      if (data.success) {
        const message = data.data.content;
        const messageTokens = message.split(" ");

        let assistantMessage = {
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        };

        // ✅ Add empty assistant message first
        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));

        // ✅ Typing animation
        messageTokens.forEach((_, i) => {
          setTimeout(() => {
            assistantMessage.content = messageTokens.slice(0, i + 1).join(" ");
            setSelectedChat((prev) => {
              const updatedMessages = [
                ...prev.messages.slice(0, -1),
                { ...assistantMessage },
              ];
              return { ...prev, messages: updatedMessages };
            });
          }, i * 100);
        });

        // ✅ Also update global chats state
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, messages: [...chat.messages, data.data] }
              : chat
          )
        );
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.message);
      setPrompt(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    "Explain quantum computing",
    "Write creative content",
    "Help with coding",
    "Analyze data trends"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Suggested Prompts - Show when input is empty and not loading */}
      {!prompt && !isLoading && selectedChat?.messages?.length === 0 && (
        <div className="mb-6 animate-fade-in">
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            {suggestedPrompts.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setPrompt(suggestion)}
                className="group px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 
                hover:border-purple-500/40 hover:bg-white/10 transition-all duration-300 text-sm text-gray-300 
                hover:text-white hover:scale-105 shadow-lg hover:shadow-purple-500/20"
              >
                <span className="group-hover:scale-105 transition-transform duration-300 inline-block font-medium">
                  ✨ {suggestion}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Prompt Box */}
      <form
        onSubmit={sendPrompt}
        className={`relative group transition-all duration-500 ${
          selectedChat?.messages?.length > 0 ? "max-w-4xl" : "max-w-3xl"
        }`}
      >
        {/* Animated background glow */}
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 
          rounded-3xl blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500"></div>
        
        {/* Main container */}
        <div className="relative bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-2xl 
          border border-white/20 rounded-3xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-300
          group-focus-within:border-purple-500/30 group-focus-within:shadow-purple-500/15">
          
          {/* Textarea */}
          <div className="p-6 pb-4">
            <textarea
              ref={textareaRef}
              onKeyDown={handleKeyDown}
              className="outline-none w-full resize-none overflow-hidden bg-transparent text-white placeholder-gray-400 
                text-base leading-relaxed max-h-32 min-h-[60px] scrollbar-hide"
              placeholder="Ask DeepVision anything..."
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              disabled={isLoading}
              rows={1}
            />
            
            {/* Character count */}
            {prompt.length > 0 && (
              <div className="absolute top-2 right-4 text-xs text-gray-500">
                {prompt.length}/2000
              </div>
            )}
          </div>

          {/* Bottom section with options and send button */}
          <div className="flex items-center justify-between px-6 pb-4 border-t border-white/10">
            {/* Left side - AI options */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="group flex items-center gap-2 text-xs border border-white/20 px-4 py-2 rounded-2xl 
                cursor-pointer hover:bg-white/10 hover:border-purple-500/40 transition-all duration-300 text-gray-300 hover:text-white
                shadow-lg hover:shadow-purple-500/20 hover:scale-105"
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-blue-500/50 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                  <Image className="relative h-4 w-4" src={assets.deepthink_icon} alt="deepthink" />
                </div>
                <span className="font-medium">DeepVision (v.1)</span>
              </button>
              
              <button
                type="button"
                className="group flex items-center gap-2 text-xs border border-white/20 px-4 py-2 rounded-2xl 
                cursor-pointer hover:bg-white/10 hover:border-blue-500/40 transition-all duration-300 text-gray-300 hover:text-white
                shadow-lg hover:shadow-blue-500/20 hover:scale-105"
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                  <Image className="relative h-4 w-4" src={assets.search_icon} alt="search" />
                </div>
                <span className="font-medium">Search</span>
              </button>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-4">
              {/* Pin button */}
              <button
                type="button"
                className="group p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 
                hover:bg-white/10 transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <Image className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" src={assets.pin_icon} alt="pin" />
              </button>

              {/* Send button */}
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className={`group relative p-3 rounded-2xl transition-all duration-300 shadow-lg ${
                  prompt.trim() && !isLoading
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:scale-110 hover:shadow-purple-500/30 border border-purple-500/30 cursor-pointer'
                    : 'bg-white/10 border border-white/20 cursor-not-allowed opacity-50'
                }`}
              >
                {/* Button glow effect */}
                {prompt.trim() && !isLoading && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/40 to-blue-500/40 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                
                <div className="relative">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Image 
                      className={`w-5 h-5 transition-all duration-300 ${
                        prompt.trim() 
                          ? 'opacity-100 group-hover:scale-110 group-hover:rotate-12' 
                          : 'opacity-50'
                      }`}
                      src={prompt.trim() ? assets.arrow_icon : assets.arrow_icon_dull}
                      alt="send"
                    />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Loading indicator bar */}
          {isLoading && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-b-3xl animate-pulse"></div>
          )}
        </div>
      </form>

      {/* Tips section for new users */}
      {selectedChat?.messages?.length === 0 && !prompt && (
        <div className="mt-6 text-center animate-fade-in">
          <p className="text-sm text-gray-400 mb-2">💡 Pro tips:</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <span>• Press Enter to send</span>
            <span>• Shift+Enter for new line</span>
            <span>• Use DeepThink for complex reasoning</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptBox;