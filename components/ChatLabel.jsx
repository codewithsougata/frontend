import { assets } from "@/assets/assets";
import Image from "next/image";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const ChatLabel = ({ openMenu, setOpenMenu, id, name }) => {
  const { fetchUsersChats, chats, setSelectedChat } = useAppContext();

  // ✅ Select a chat safely
  const selectChat = () => {
    if (!id) {
      toast.error("This chat is not saved yet.");
      return;
    }
    const chatData = chats.find((chat) => chat._id === id);
    if (chatData) {
      setSelectedChat(chatData);
      console.log("Selected chat:", chatData);
    }
  };

  // ✅ Rename chat
  const renameHandler = async () => {
    if (!id) {
      toast.error("Chat not saved yet. Please refresh or create again.");
      return;
    }

    try {
      const newName = prompt("Enter new name");
      if (!newName) return;

      const { data } = await axios.post("/api/chat/rename", {
        chatId: id,
        name: newName,
      });

      if (data.success) {
        fetchUsersChats();
        setOpenMenu({ id: 0, open: false });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to rename chat");
    }
  };

  // ✅ Delete chat
  const deleteHandler = async () => {
    if (!id) {
      toast.error("Chat not saved yet. Please refresh or create again.");
      return;
    }

    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this chat?"
      );
      if (!confirmDelete) return;

      const { data } = await axios.post("/api/chat/delete", { chatId: id });

      if (data.success) {
        fetchUsersChats();
        setOpenMenu({ id: 0, open: false });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete chat");
    }
  };

  return (
    <div
      onClick={selectChat}
      className="flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer"
    >
      {/* ✅ Dynamic name */}
      <p className="group-hover:max-w-5/6 truncate">{name || "Untitled Chat"}</p>

      {/* Dots Menu */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenu({ id: id, open: !openMenu.open });
        }}
        className="relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg"
      >
        <Image
          src={assets.three_dots}
          alt="menu"
          className={`w-4 ${
            openMenu.id === id && openMenu.open ? "" : "hidden"
          } group-hover:block`}
        />

        <div
          className={`absolute ${
            openMenu.id === id && openMenu.open ? "block" : "hidden"
          } -right-36 bg-gray-700 rounded-xl w-max p-2`}
        >
          {/* Rename Option */}
          <div
            onClick={renameHandler}
            className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-1 rounded"
          >
            <Image src={assets.pencil_icon} alt="Rename" className="w-4" />
            <p>Rename</p>
          </div>

          {/* Delete Option */}
          <div
            onClick={deleteHandler}
            className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-1 rounded"
          >
            <Image src={assets.delete_icon} alt="Delete" className="w-4" />
            <p>Delete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLabel;
