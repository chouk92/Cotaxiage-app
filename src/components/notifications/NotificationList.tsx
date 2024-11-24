import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../stores/notificationStore';
import LoadingSpinner from '../common/LoadingSpinner';

export default function NotificationList() {
  const navigate = useNavigate();
  const { notifications, loading, error, markAsRead, markAllAsRead } = useNotificationStore();

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.tripId) {
      navigate(`/trip/${notification.tripId}`);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No notifications
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">Notifications</h3>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="divide-y">
        {notifications.map((notification) => (
          <button
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">{notification.title}</p>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>
              {!notification.read && (
                <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {format(notification.createdAt, 'PPp', { locale: fr })}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}