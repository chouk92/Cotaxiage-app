import { useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useChatStore } from '../stores/chatStore';
import { useAuth } from '../contexts/AuthContext';
import { Chat } from '../types/message';

export function useChat() {
  const { user } = useAuth();
  const { setChats, setLoading, setError } = useChatStore();

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const chatsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as Chat[];

        setChats(chatsData);
        setError(null);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching chats:', error);
        setError('Failed to load chats');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, setChats, setLoading, setError]);

  return useChatStore();
}