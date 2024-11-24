import React from 'react';
import { Camera, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { UserProfile } from '../../types/user';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { user } = useAuth();
  const isOwnProfile = user?.uid === profile.uid;

  const formatDate = (date: Date | null) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'Unknown date';
    }
    return format(date, 'MMMM yyyy');
  };

  return (
    <div className="relative">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600">
        {isOwnProfile && (
          <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30">
            <Camera className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full ring-4 ring-white bg-white sm:h-32 sm:w-32 overflow-hidden">
              <img
                src={profile.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName || 'User')}&background=0D8ABC&color=fff`}
                alt={profile.displayName || 'Profile'}
                className="h-full w-full object-cover"
              />
            </div>
            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {profile.displayName || 'Anonymous User'}
              </h1>
              {profile.bio && (
                <p className="mt-1 text-gray-500">{profile.bio}</p>
              )}
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                Joined {formatDate(profile.createdAt)}
              </div>
            </div>

            {isOwnProfile && (
              <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}