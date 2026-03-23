import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";

const ChatBox = () => {
  const { selectedChat, theme, user, axios, token, setUser } = useAppContext();
  const containerref = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!user) return toast("Login to send message");

      setLoading(true);

      const promptCopy = prompt;
      setPrompt("");

      // Add user message instantly
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: promptCopy,
          timestamp: Date.now(),
          isImage: false,
        },
      ]);

      const { data } = await axios.post(
        `/api/messages/${mode}`,
        {
          chatId: selectedChat._id,
          prompt: promptCopy,
          isPublished,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        // ✅ FIXED
        setMessages((prev) => [...prev, data.reply]);

        // credits update
        setUser((prev) => ({
          ...prev,
          credits: prev.credits - (mode === "image" ? 2 : 1),
        }));
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat?.messages || []);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerref.current) {
      containerref.current.scrollTo({
        top: containerref.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full max-h-screen p-5 md:p-10 xl:px-20">
      
      {/* Messages */}
      <div ref={containerref} className="flex-1 overflow-y-auto mb-3">
        
        {messages?.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt="logo"
              className="w-full max-w-56 sm:max-w-68"
            />
            <p className="mt-5 text-4xl text-gray-400 dark:text-white">
              Ask me anything.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {loading && (
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
          </div>
        )}
      </div>

      {/* Image publish toggle */}
      {mode === "image" && (
        <label className="flex gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs">Publish Image to Community</p>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </label>
      )}

      {/* Input */}
      <form onSubmit={onSubmit} className="flex gap-4 p-3 border rounded-xl items-center bg-white dark:bg-[#1e1b2e]">
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>

        <textarea
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
  placeholder="Type your prompt..."
  required
  rows={1}
  className="flex-1 resize-none outline-none max-h-32 overflow-y-auto"
/>

        <button disabled={loading}>
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            className="w-8"
            alt="send"
          />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;