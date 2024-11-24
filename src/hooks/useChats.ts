import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, Query, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Chat } from '../types/message';
import { useAuth } from '../contexts/AuthContext';

export function useChats() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('participants', 'array-contains', user.uid),
        orderBy('updatedAt', 'desc')
      ) as Query<DocumentData>;

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const chatData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            lastMessage: doc.data().lastMessage && {
              ...doc.data().lastMessage,
              timestamp: doc.data().lastMessage.timestamp?.toDate() || new Date()
            }
          })) as Chat[];

          setChats(chatData);
          setError(null);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching chats:', err);
          setError('Unable to load chats');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up chat listener:', err);
      setError('Failed to initialize chat system');
      setLoading(false);
    }
  }, [user]);

  return { chats, loading, error };
}