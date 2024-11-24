import React, { useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { Chat } from '../../types/message';
import { useMessages } from '../../hooks/useMessages';
import { useSendMessage } from '../../hooks/useSendMessage';
import MessageList from './MessageList';

interface ChatWindowProps {
  chat: Chat;
  onClose: () => void;
}

export default function ChatWindow({ chat, onClose }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const { messages, loading, error } = useMessages(chat.id);
  const { sendMessage, sending } = useSendMessage(chat.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      await sendMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 bg-white border-b flex items-center">
        <button
          onClick={onClose}
          className="mr-3 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-medium">
          {chat.bookingId ? `Booking #${chat.bookingId}` : 'Direct Message'}
        </h3>
      </div>

      <MessageList
        messages={messages}
        loading={loading}
        error={error}
      />

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}