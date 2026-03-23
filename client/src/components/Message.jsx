import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import moment from "moment";
import Markdown from "react-markdown";
import Prism from "prismjs";

const Message = ({ message }) => {

  useEffect(() => {
    if (message?.content) {
      Prism.highlightAll();
    }
  }, [message?.content]);

  return (
    <div>
      {message?.role === "user" ? (
        <div className="flex items-start justify-end my-4 gap-2">
          
          {/* User Message */}
          <div className="flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl">
            <p className="text-sm dark:text-primary">
              {message?.content}
            </p>

            <span className="text-xs text-gray-400">
              {message?.timestamp && moment(message.timestamp).fromNow()}
            </span>
          </div>

          <img
            src={assets.user_icon}
            alt="user"
            className="w-8 rounded-full"
          />
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md my-4">
            
            {/* Assistant Message */}
            {message?.isImage ? (
              <img
                src={message?.content}
                alt="generated"
                className="w-full max-w-md mt-2 rounded-md"
              />
            ) : (
              <div className="text-sm dark:text-primary">
                <Markdown
                  children={message?.content || ""}
                  components={{
                    code({ inline, className, children }) {
                      return !inline ? (
                        <pre className="bg-black text-white p-2 rounded-md overflow-x-auto">
                          <code className={className}>{children}</code>
                        </pre>
                      ) : (
                        <code className="bg-gray-200 px-1 rounded">
                          {children}
                        </code>
                      );
                    },
                  }}
                />
              </div>
            )}

            <span className="text-xs text-gray-400">
              {message?.timestamp && moment(message.timestamp).fromNow()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;