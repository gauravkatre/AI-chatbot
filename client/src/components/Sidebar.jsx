import React, { useState } from "react";
import { assets } from "../assets/assets.js";
import { useAppContext } from "../context/AppContext.jsx";
import moment from "moment";
import toast from "react-hot-toast";
import { data } from "react-router-dom";


const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
    createnewChat,
    setToken,
    axios,
    fetchUserChats,
    setChats,
    token
  } = useAppContext();

  const [search, setSearch] = useState("");
  


  // ✅ LOGOUT FIX
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login"); // 👈 added
    toast.success("Logged out Successfully");
  };

  // ✅ DELETE CHAT FIXED
  const deletechat = async (e, chatId) => {
    e.stopPropagation(); // 👈 important

    try {
      const conf = window.confirm("Are you sure want to delete this?");
      if (!conf) return;

      const { data } = await axios.delete("/api/chats/delete", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  data: { chatId },
});

      if (data.success) {
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));
        await fetchUserChats(); // 👈 fixed
        toast.success(data.message);
      }
    } catch (error) {
      console.log("ERROR 👉", error);
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div
      className={`flex flex-col h-screen min-w-72 p-5 
      dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 
      border-r border-[#80609F]/30 backdrop-blur-3xl
      transition-all duration-500 max-md:absolute left-0 z-10 ${
        !isMenuOpen && "max-md:-translate-x-full"
      }`}
    >
      {/* Logo */}
      <img
        src={
          theme === "dark"
            ? assets.logo_full
            : assets.logo_full_dark
        }
        alt="Logo"
        className="w-full max-w-48"
      />

      {/* New Chat Button */}
      <button
        onClick={createnewChat}
        className="flex justify-center items-center w-full py-2 mt-10 
        text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] 
        text-sm rounded-md cursor-pointer"
      >
        <span className="mr-2 text-xl">+</span>
        New Chat
      </button>

      {/* Search */}
      <div
        className="flex items-center gap-2 p-3 mt-4 
        border border-gray-400 dark:border-white/20 
        rounded-md"
      >
        <img
          src={assets.search_icon}
          className="w-4 not-dark:invert"
          alt="Search"
        />

        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search conversations"
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      {/* Chats */}
      {chats.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <p className="mt-4 text-sm text-gray-700 dark:text-white">
            Recent Chats
          </p>

          <div className="overflow-y-auto mt-3 text-sm space-y-3 dark:text-white">
            {chats
              .filter((chat) =>
  chat?.messages?.length > 0
    ? chat.messages[0]?.content
        ?.toLowerCase()
        .includes(search.toLowerCase())
    : chat?.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
)
              .map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => {setSelectedChat(chat)
                    navigate('/')}
                         
                  }
                  className="p-2 px-4 dark:bg-[#573170]/10 
                  border border-gray-300 
                  dark:border-[#80609F]/15 
                  rounded-md cursor-pointer 
                  flex justify-between group hover:scale-105 transition-all"
                >
                  <div>
                    <p className="truncate w-full">
  {chat?.messages?.length > 0
    ? chat.messages[0]?.content?.slice(0, 32)
    : chat?.name || "New Chat"}
</p>

                    <p className="text-xs text-gray-500 dark:text-[#81A6C0]">
                      {moment(chat.updatedAt).fromNow()}
                    </p>
                  </div>

                  {/* ✅ DELETE BUTTON FIXED */}
                  <img
                    src={assets.bin_icon}
                    alt="Delete"
                    className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
                    onClick={(e) =>
                      toast.promise(
                        deletechat(e, chat._id),
                        {
                          loading: "Deleting...",
                          success: "Deleted",
                          error: "Error deleting"
                        }
                      )
                    }
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Community */}
      <div
        onClick={() => navigate("/community")}
        className="flex items-center gap-2 p-3 mt-4 
        border border-gray-300 dark:border-white/15 
        rounded-md cursor-pointer 
        hover:scale-105 transition-all duration-300"
      >
        <img
          src={assets.gallery_icon}
          className="w-4.5 not-dark:invert"
          alt="Community"
        />
        <p className="text-sm text-gray-700 dark:text-white">
          Community Images
        </p>
      </div>

      {/* Credits */}
      <div
        onClick={() => navigate("/credits")}
        className="flex items-center gap-2 p-3 mt-4 
        border border-gray-300 dark:border-white/15 
        rounded-md cursor-pointer 
        hover:scale-105 transition-all duration-300"
      >
        <img
          src={assets.diamond_icon}
          className="w-4.5 not-dark:invert"
          alt="Credits"
        />
        <div className="flex flex-col text-sm">
          <p className="text-gray-700 dark:text-white">
            Credits : {user?.credits || 0}
          </p>
          <p className="text-xs text-gray-400">
            Purchase Credits
          </p>
        </div>
      </div>

      {/* Theme Toggle */}
      <div
        className="flex items-center gap-2 p-3 mt-4 
        border border-gray-300 dark:border-white/15 
        rounded-md"
      >
        <div className="flex items-center gap-2 text-sm w-full justify-between">
          <div className="flex items-center gap-2">
            <img
              src={assets.theme_icon}
              className="w-4 not-dark:invert"
              alt="Theme"
            />
            <p>Dark Mode</p>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={theme === "dark"}
              onChange={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            />

            <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all duration-300"></div>

            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-4"></span>
          </label>
        </div>
      </div>

      {/* User */}
      <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
        <img
          src={assets.user_icon}
          className="w-7 rounded-full"
          alt="User"
        />

        <p className="flex-1 text-sm text-gray-700 dark:text-white truncate">
          {user ? user.name : "Login your account"}
        </p>

        {user && (
          <img
            onClick={logout}
            src={assets.logout_icon}
            className="h-5 cursor-pointer hidden not-dark:invert group-hover:block"
            alt="Logout"
          />
        )}
      </div>

      {/* Close Menu */}
      <img
        src={assets.close_icon}
        alt="Close Menu"
        className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert"
        onClick={() => setIsMenuOpen(false)}
      />
    </div>
  );
};

export default Sidebar;