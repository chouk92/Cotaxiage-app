import { useState } from 'react';
import { addDoc, collection, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export function useSendMessage(chatId: string) {
  const [sending, setSending] = useState(false);
  const { user } = useAuth();

  const sendMessage = async (content: string) => {
    if (!user) {
      toast.error('You must be logged in to send messages');
      return;
    }
    
    setSending(true);
    try {
      const messageData = {
        chatId,
        senderId: user.uid,
        content,
        timestamp: serverTimestamp(),
        read: false
      };

      // Add message to messages collection
      const messageRef = await addDoc(collection(db, 'messages'), messageData);

      // Update chat's last message
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: {
          ...messageData,
          id: messageRef.id
        },
        updatedAt: serverTimestamp()
      });

      return messageRef.id;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(
        error.code === 'permission-denied'
          ? 'You do not have permission to send messages in this chat'
          : 'Failed to send message'
      );
      throw error;
    } finally {
      setSending(false);
    }
  };

  return { sendMessage, sending };
}