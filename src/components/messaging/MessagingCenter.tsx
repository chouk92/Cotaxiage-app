import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { Chat } from '../../types/message';

export default function MessagingCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Messaging panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
            <h2 className="text-lg font-medium">Messages</h2>
            <button
              onClick={() => {
                setIsOpen(false);
                setSelectedChat(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {selectedChat ? (
              <ChatWindow
                chat={selectedChat}
                onClose={() => setSelectedChat(null)}
              />
            ) : (
              <ChatList onSelectChat={setSelectedChat} />
            )}
          </div>
        </div>
      )}
    </>
  );
}