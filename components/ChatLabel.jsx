import { assets } from "@/assets/assets";
import Image from "next/image";
import React from "react";

const ChatLabel = ({ openMenu, setOpenMenu }) => {
  return (
    <div className="flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer">
      <p className="group-hover:max-w-5/6 truncate">Chat Name Here</p>

      {/* Dots Menu */}
      <div
        className="relative flex items-center justify-center h-6 w-6 ACaspect-square hover:bg-black/80 rounded-lg"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <Image
          src={assets.three_dots}
          alt=""
          className={`w-4 ${openMenu ? "" : "hidden"} group-hover:block`}
        />

        <div
          className={`absolute ${
            openMenu ? "block" : "hidden"
          } left-4 top-full mt-1 bg-black rounded-lg p-2 flex flex-col w-28 shadow-lg z-10`}
        >
          {/* Rename Option */}
          <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-1 rounded">
            <Image src={assets.pencil_icon} alt="Rename" className="w-4" />
            <p>Rename</p>
          </div>

          {/* Delete Option */}
          <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-1 rounded">
            <Image src={assets.delete_icon} alt="Delete" className="w-4" />
            <p>Delete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLabel;
