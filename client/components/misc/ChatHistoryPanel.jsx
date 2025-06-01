import React from "react";
import {
  ChevronLeft,
  Trash as TrashIcon,
  ChartAreaIcon,
  MessageCircle,
} from "lucide-react";

const ChatHistoryPanel = ({
  isOpen,
  onClose,
  chatHistory,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  title = "Chat History",
}) => {
  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? "translate-x-0 w-80" : "translate-x-full w-80"
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close chat history"
            >
              <ChevronLeft />
            </button>
          </div>

          {chatHistory.length > 0 ? (
            <ul className="space-y-1 overflow-y-auto flex-grow pr-1">
              {chatHistory.map((chat) => (
                <li
                  key={chat.id}
                  className="group p-3 rounded-md hover:bg-gray-100 cursor-pointer border border-transparent hover:border-gray-200 flex justify-between items-center"
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div>
                    <h4 className="font-medium text-sm text-gray-800 truncate w-48">
                      {chat.title}
                    </h4>
                    <p className="text-xs text-gray-500 truncate w-48">
                      {chat.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {chat.timestamp}
                    </p>
                  </div>
                  <button
                    onClick={(e) => onDeleteChat(chat.id, e)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-100"
                    aria-label={`Delete chat ${chat.title}`}
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500">
              <MessageCircle />
              <p className="mt-2 text-sm">No chat history yet.</p>
              <p className="text-xs">
                Start a new conversation or perform a search to see it here.
              </p>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={onNewChat}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 text-sm"
            >
              + New Chat
            </button>
          </div>
        </div>
      </div>

      {!isOpen && (
        <button
          onClick={onClose}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 z-20"
          aria-label="Open chat history"
        >
          <MessageCircle />
        </button>
      )}
    </>
  );
};

export default ChatHistoryPanel;
