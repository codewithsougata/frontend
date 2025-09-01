import { assets } from "@/assets/assets";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";
import ChatLabel from "./ChatLabel";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Sidebar = ({ expand, setExpand }) => {
  const { openSignIn } = useClerk();
  const { user, chats, fetchUsersChats, setSelectedChat } = useAppContext();
  const [openMenu, setOpenMenu] = useState({ id: 0, open: false });

  // ✅ Create new chat and save to DB immediately
  const createNewChat = async () => {
    try {
      const { data } = await axios.post("/api/chat/create");
      if (data.success) {
        toast.success("New chat created");
        fetchUsersChats(); // refresh sidebar list
        setSelectedChat(data.chat); // set newly created chat as active
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to create chat");
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {expand && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setExpand(false)}
        />
      )}

      <div
        className={`flex flex-col justify-between bg-gradient-to-b from-emerald-900/20 via-fuchsia-900/10 to-rose-900/20 backdrop-blur-2xl border-r border-white/15 transition-all duration-500 z-50 relative shadow-2xl
        max-md:absolute max-md:h-screen ${
          expand ? "p-6 w-80" : "md:w-20 w-0"
        } max-md:overflow-hidden`}
      >
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 -left-10 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 -right-10 w-40 h-40 bg-gradient-to-br from-fuchsia-500/20 to-rose-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10">
          {/* Logo + Toggle */}
          <div
            className={`flex ${
              expand
                ? "flex-row justify-between items-center mb-8"
                : "flex-col items-center gap-8 mb-6"
            }`}
          >
            {/* Logo */}
            <div
              className={`transition-all duration-500 ${
                expand ? "scale-100" : "scale-90"
              }`}
            >
              <Image
                className={`transition-all duration-500 filter drop-shadow-2xl ${
                  expand ? "w-32" : "w-10"
                }`}
                src={expand ? assets.logo_text : assets.logo_icon}
                alt="logo"
              />
            </div>

            {/* Toggle Button */}
            <div
              onClick={() => setExpand(!expand)}
              className="group relative flex items-center justify-center bg-white/8 backdrop-blur-lg
              hover:bg-gradient-to-r hover:from-fuchsia-500/20 hover:to-pink-500/20 transition-all duration-300 h-12 w-12 rounded-2xl cursor-pointer
              border border-white/15 hover:border-fuchsia-400/40 shadow-lg hover:shadow-pink-500/40 hover:scale-105"
            >
              <Image src={assets.menu_icon} alt="menu" className="md:hidden w-5 h-5" />
              <Image
                src={expand ? assets.sidebar_close_icon : assets.sidebar_icon}
                alt="toggle"
                className={`hidden md:block w-6 h-6 transition-all duration-500 group-hover:scale-110 ${
                  expand ? "rotate-180" : ""
                }`}
              />

              {/* Tooltip */}
              <div
                className={`absolute w-max ${
                  expand
                    ? "left-1/2 -translate-x-1/2 top-16"
                    : "left-1/2 -translate-x-1/2 -top-16"
                } opacity-0 group-hover:opacity-100 transition-all duration-300 
                bg-black/95 backdrop-blur-xl text-white text-sm px-4 py-2 rounded-xl shadow-2xl pointer-events-none z-50 border border-white/20`}
              >
                {expand ? "Close sidebar" : "Open sidebar"}
                <div
                  className={`w-3 h-3 absolute bg-black rotate-45 ${
                    expand
                      ? "left-1/2 -top-1.5 -translate-x-1/2"
                      : "left-1/2 -translate-x-1/2 -bottom-1.5"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={createNewChat}
            className={`flex items-center justify-center cursor-pointer transition-all duration-300 group relative ${
              expand
                ? "bg-gradient-to-r from-fuchsia-600/80 to-pink-600/80 hover:from-fuchsia-600 hover:to-pink-600 rounded-2xl gap-3 p-4 w-full shadow-lg hover:shadow-fuchsia-500/40 hover:scale-[1.02] border border-pink-500/30 backdrop-blur-lg"
                : "h-12 w-12 mx-auto hover:bg-white/15 rounded-2xl border border-white/15 hover:border-pink-400/40 shadow-lg hover:shadow-pink-500/25 hover:scale-105"
            }`}
          >
            <Image
              className={`${
                expand ? "w-6 h-6" : "w-6 h-6"
              } transition-all duration-300 ${expand ? "" : "group-hover:scale-110"}`}
              src={expand ? assets.chat_icon : assets.chat_icon_dull}
              alt="chat"
            />

            {!expand && (
              <div className="absolute w-max -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/95 backdrop-blur-xl text-white text-sm px-4 py-2 rounded-xl shadow-2xl pointer-events-none z-50 border border-white/20">
                New chat
                <div className="w-3 h-3 absolute bg-black rotate-45 left-1/2 -translate-x-1/2 -bottom-1.5"></div>
              </div>
            )}

            {expand && (
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">New chat</span>
                <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse"></div>
              </div>
            )}
          </button>

          {/* Recent Chats */}
          <div
            className={`mt-8 text-white/70 text-sm transition-all duration-500 ${
              expand ? "block opacity-100" : "hidden opacity-0"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-gradient-to-b from-fuchsia-400 to-pink-400 rounded-full"></div>
              <p className="font-medium text-pink-300">Recent Chats</p>
            </div>

            <div
              className="space-y-1 max-h-80 overflow-y-auto pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.3) transparent",
              }}
            >
              {chats.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/8 border border-white/15 flex items-center justify-center">
                    <span className="text-2xl opacity-60">💬</span>
                  </div>
                  <p className="text-white/50 text-sm mb-1">No chats yet</p>
                  <p className="text-white/30 text-xs">Start a conversation above</p>
                </div>
              ) : (
                chats.map((chat, index) => (
                  <div
                    key={chat._id || index}
                    className="transform transition-all duration-300 hover:scale-[1.02]"
                  >
                    <ChatLabel
                      name={chat.name}
                      id={chat._id}
                      openMenu={openMenu}
                      setOpenMenu={setOpenMenu}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative z-10 space-y-3">
          {/* Get App */}
          <div
            className={`flex items-center cursor-pointer group relative transition-all duration-300 ${
              expand
                ? "gap-3 text-white/80 text-sm p-4 border border-white/15 rounded-2xl hover:bg-fuchsia-500/10 hover:border-fuchsia-400/40 shadow-lg"
                : "h-12 w-12 mx-auto hover:bg-fuchsia-500/10 rounded-2xl justify-center border border-white/15 hover:border-fuchsia-400/40 shadow-lg hover:scale-105"
            }`}
          >
            <Image
              className={`${
                expand ? "w-5 h-5" : "w-6 h-6"
              } transition-all duration-300 ${expand ? "" : "group-hover:scale-110"}`}
              src={expand ? assets.phone_icon : assets.phone_icon_dull}
              alt="phone"
            />

            {/* QR Code Tooltip */}
            <div
              className={`absolute transition-all duration-300 pointer-events-none ${
                !expand ? "-top-80 -right-48" : "-top-80 left-1/2 -translate-x-1/2"
              } opacity-0 group-hover:opacity-100 z-50`}
            >
              <div className="relative bg-black/95 backdrop-blur-xl text-white text-sm p-6 rounded-2xl shadow-2xl border border-white/25">
                <div className="mb-4 p-2 bg-white rounded-xl">
                  <Image src={assets.qrcode} alt="qr" className="w-36 h-36" />
                </div>
                <p className="text-center font-medium">Scan to get DeepVision App</p>
                <div
                  className={`w-4 h-4 absolute bg-black rotate-45 ${
                    expand
                      ? "left-1/2 -translate-x-1/2 -bottom-2"
                      : "left-6 -bottom-2"
                  }`}
                ></div>
              </div>
            </div>

            {expand && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Get App</span>
                <div className="px-2 py-1 bg-gradient-to-r from-fuchsia-500/25 to-pink-500/25 rounded-full border border-pink-500/40">
                  <Image alt="new" src={assets.new_icon} className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div
            onClick={user ? null : openSignIn}
            className={`flex items-center transition-all duration-300 group cursor-pointer ${
              expand
                ? "hover:bg-fuchsia-500/10 rounded-2xl gap-3 p-4 border border-white/15 hover:border-fuchsia-400/40 shadow-lg"
                : "justify-center w-12 h-12 mx-auto hover:bg-fuchsia-500/10 rounded-2xl border border-white/15 hover:border-fuchsia-400/40 shadow-lg hover:scale-105"
            }`}
          >
            {user ? (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500/60 to-pink-500/60 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <UserButton />
              </div>
            ) : (
              <Image src={assets.profile_icon} alt="profile" className="w-7 h-7" />
            )}

            {expand && (
              <div className="flex items-center gap-2">
                <span className="text-white/80 font-medium">
                  {user ? "My Profile" : "Sign In"}
                </span>
                {user && (
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                )}
              </div>
            )}
          </div>

          {/* Version */}
          {expand && (
            <div className="text-center pt-4 border-t border-white/15">
              <p className="text-xs text-white/40 mb-1">DeepVision v2.0</p>
              <div className="flex items-center justify-center gap-1 text-xs text-white/30">
                <span>Powered by</span>
                <div className="w-1 h-1 rounded-full bg-fuchsia-400 animate-pulse"></div>
                <span className="font-semibold">AI</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
