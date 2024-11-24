import React from 'react';
import { format } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Chat } from '../../types/message';
import { useChats } from '../../hooks/useChats';

interface ChatListProps {
  onSelectChat: (chat: Chat) => void;
}

export default function ChatList({ onSelectChat }: ChatListProps) {
  const { user } = useAuth();
  const { chats, loading, error } = useChats();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p>Please sign in to view your chats</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500 px-4">
        <p className="text-center">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-blue-600 hover:text-blue-700 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <MessageCircle className="h-12 w-12 mb-4" />
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onSelectChat(chat)}
          className="w-full p-4 hover:bg-gray-50 transition-colors flex items-start space-x-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 truncate">
                {chat.bookingId ? `Booking #${chat.bookingId}` : 'Direct Message'}
              </p>
              {chat.lastMessage && (
                <p className="text-xs text-gray-500">
                  {format(chat.lastMessage.timestamp, 'p')}
                </p>
              )}
            </div>
            {chat.lastMessage && (
              <p className="mt-1 text-sm text-gray-600 truncate">
                {chat.lastMessage.content}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}