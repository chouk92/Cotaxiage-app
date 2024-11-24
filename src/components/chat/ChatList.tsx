import React from 'react';
import { format } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { Chat } from '../../types/message';

export default function ChatList() {
  const { chats, loading, error, setActiveChat } = useChatStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p className="text-center mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!chats.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <MessageCircle className="h-12 w-12 mb-4" />
        <p>No conversations yet</p>
      </div>
    );
  }

  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
  };

  return (
    <div className="divide-y divide-gray-200">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => handleSelectChat(chat)}
          className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {chat.participants.length > 2 ? 'Group Chat' : 'Direct Message'}
              </p>
              {chat.lastMessage && (
                <p className="mt-1 text-sm text-gray-500 truncate">
                  {chat.lastMessage.content}
                </p>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {format(chat.updatedAt, 'MMM d, h:mm a')}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}