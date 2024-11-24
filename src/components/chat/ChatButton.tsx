import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import ChatWindow from './ChatWindow';
import ChatList from './ChatList';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeChat } = useChat();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-medium">Messages</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeChat ? <ChatWindow /> : <ChatList />}
          </div>
        </div>
      )}
    </>
  );
}