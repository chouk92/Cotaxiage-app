import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types/user';

export function useParticipants(participantIds: string[]) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const participantPromises = participantIds.map(async (uid) => {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            return {
              uid: userDoc.id,
              ...userDoc.data()
            } as UserProfile;
          }
          return null;
        });

        const participants = (await Promise.all(participantPromises)).filter(
          (user): user is UserProfile => user !== null
        );

        setUsers(participants);
        setError(null);
      } catch (err) {
        console.error('Error fetching participants:', err);
        setError('Failed to load participants');
      } finally {
        setLoading(false);
      }
    };

    if (participantIds.length > 0) {
      fetchParticipants();
    } else {
      setLoading(false);
    }
  }, [participantIds]);

  return { users, loading, error };
}