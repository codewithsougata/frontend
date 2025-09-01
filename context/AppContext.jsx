"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  // ✅ create new chat
  const createNewChat = async () => {
    try {
      if (!user) return null;
      const token = await getToken();

      await axios.post(
        "/api/chat/create",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsersChats(); // use plural
    } catch (error) {
      handleApiError(error);
    }
  };

  // ✅ fetch all chats
  const fetchUsersChats = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/chat/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        let chatsList = data.data;

        if (chatsList.length === 0) {
          await createNewChat();
          return fetchUsersChats();
        } else {
          // sort chats by updated date
          chatsList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setChats(chatsList);
          setSelectedChat(chatsList[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // ✅ reusable error handler
  const handleApiError = (error) => {
    if (error.response?.status === 402) {
      toast.error("⚠️ DeepSeek balance exhausted. Please recharge!");
    } else {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ load chats on login
  useEffect(() => {
    if (user) {
      fetchUsersChats();
    }
  }, [user]);

  const value = {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    createNewChat,
    fetchUsersChats, // ✅ fixed naming
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
