import { useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useChatStore } from '../stores/chatStore';
import { Message } from '../types/message';

export function useMessages(chatId: string) {
  const { setMessages, setError } = useChatStore();

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        })) as Message[];

        setMessages(messagesData);
        setError(null);
      },
      (error) => {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages');
      }
    );

    return () => unsubscribe();
  }, [chatId, setMessages, setError]);
}