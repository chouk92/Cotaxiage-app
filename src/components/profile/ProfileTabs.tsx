import React from 'react';
import { History, Settings, Star } from 'lucide-react';
import { UserProfile } from '../../types/user';
import UserTripList from '../trip/UserTripList';
import ProfileSettingsPanel from './ProfileSettings';
import UserReviews from './UserReviews';

interface ProfileTabsProps {
  profile: UserProfile;
  isOwnProfile: boolean;
}

export default function ProfileTabs({ profile, isOwnProfile }: ProfileTabsProps) {
  const [currentTab, setCurrentTab] = React.useState('trips');

  const tabs = [
    { id: 'trips', name: 'My Trips', icon: History },
    { id: 'reviews', name: 'Reviews', icon: Star },
    ...(isOwnProfile ? [{ id: 'settings', name: 'Settings', icon: Settings }] : []),
  ];

  const renderTabContent = () => {
    switch (currentTab) {
      case 'trips':
        return <UserTripList userId={profile.uid} />;
      case 'reviews':
        return <UserReviews userId={profile.uid} />;
      case 'settings':
        return isOwnProfile ? <ProfileSettingsPanel /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="mt-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${currentTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon
                className={`
                  -ml-0.5 mr-2 h-5 w-5
                  ${currentTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                `}
              />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        {renderTabContent()}
      </div>
    </div>
  );
}