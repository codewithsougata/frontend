import Image from "next/image";
import React from "react";
import { assets } from "@/assets/assets";


const Message = ({ role, content }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-3xl text-sm">
      {/* Wrapper for each message */}
      <div
        className={`flex flex-col w-full mb-8 ${
          role === "user" && "items-end"
        }`}
      >
        {/* Chat bubble */}
        <div
          className={`group relative flex max-w-2xl py-3 rounded-xl ${
            role === "user"
              ? "bg-[#414158] px-5 text-white"
              : "bg-gray-200 gap-3 text-black"
          }`}
        >
          <div
            className={`opacity-0 group-hover:opacity-100 absolute transition-all ${
              role === "user" ? "-left-16 top-2.5" : "left-9 bottom-6"
            }`}
          >
            <div className="flex items-center gap-2 opacity-70">
              {role === "user" ? (
                <>
                  <Image
                    className="w-4 cursor-pointer"
                    src={assets.copy_icon}
                    alt=""
                  />

                  <Image
                    className="w-4.5 cursor-pointer"
                    src={assets.pencil_icon}
                    alt=""
                  />
                </>
              ) : (
                <>
                  <Image
                    className="w-4.5 cursor-pointer"
                    src={assets.copy_icon}
                    alt=""
                  />

                  <Image
                    className="w-4 cursor-pointer"
                    src={assets.regenerate_icon}
                    alt=""
                  />

                  <Image
                    className="w-4 cursor-pointer"
                    src={assets.like_icon}
                    alt=""
                  />

                  <Image
                    className="w-4 cursor-pointer"
                    src={assets.dislike_icon}
                    alt=""
                  />
                </>
              )}
            </div>
          </div>
          {role === "user" ? (
            <span className="text-white/90">{content}</span>
          ) : (
            <>
              <Image
                src={assets.logo_icon}
                alt=""
                className="h-9 w-9 p-1
                    border border-white/15 rounded-full"
              />
              <div className="space-y-4 w-full overflow-scroll">{content}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
