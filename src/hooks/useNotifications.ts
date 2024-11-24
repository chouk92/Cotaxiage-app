import { useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNotificationStore } from '../stores/notificationStore';
import { Notification } from '../types/notification';

export function useNotifications() {
  const { user } = useAuth();
  const { setNotifications, setError, setLoading } = useNotificationStore();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt instanceof Timestamp 
              ? doc.data().createdAt.toDate() 
              : new Date()
          })) as Notification[];

          setNotifications(notifications);
          setError(null);
          setLoading(false);
        },
        (error: any) => {
          console.error('Error loading notifications:', error);
          setError(error.code === 'permission-denied'
            ? 'You do not have permission to view notifications'
            : 'Failed to load notifications');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error initializing notifications:', err);
      setError('Failed to initialize notifications');
      setLoading(false);
    }
  }, [user, setNotifications, setError, setLoading]);

  return useNotificationStore();
}