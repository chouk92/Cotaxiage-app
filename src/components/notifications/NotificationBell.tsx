import React from 'react';
import { Bell } from 'lucide-react';
import { Popover, Transition } from '@headlessui/react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationList from './NotificationList';

export default function NotificationBell() {
  const { unreadCount } = useNotifications();

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none">
            <Bell className="h-6 w-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </Popover.Button>

          <Transition
            show={open}
            enter="transition duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition duration-150 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              static
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="p-4 border-b">
                <h3 className="font-medium">Notifications</h3>
              </div>
              <NotificationList />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}