import React from 'react';
import { User } from 'lucide-react';
import { useParticipants } from '../../hooks/useParticipants';

interface ParticipantsListProps {
  participants: string[];
}

export default function ParticipantsList({ participants }: ParticipantsListProps) {
  const { users, loading, error } = useParticipants(participants);

  if (loading || error || users.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-gray-900">Participants</h3>
      <div className="flex flex-wrap gap-2">
        {users.map(user => (
          <div
            key={user.uid}
            className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full"
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Utilisateur'}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
            <span className="text-sm text-gray-700">
              {user.displayName || 'Anonyme'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}