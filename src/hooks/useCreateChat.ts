import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export function useCreateChat() {
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();

  const createChat = async (participantId: string, bookingId?: string) => {
    if (!user) {
      toast.error('You must be logged in to start a chat');
      return null;
    }

    setCreating(true);
    try {
      const chatData = {
        participants: [user.uid, participantId],
        bookingId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const chatRef = await addDoc(collection(db, 'chats'), chatData);
      return chatRef.id;
    } catch (error: any) {
      console.error('Error creating chat:', error);
      toast.error('Failed to create chat');
      return null;
    } finally {
      setCreating(false);
    }
  };

  return { createChat, creating };
}