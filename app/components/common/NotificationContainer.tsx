'use client'

import React from 'react';
import { useNotification } from './NotificationContext';
import ToastNotification from './ToastNotification';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            transform: `translateY(${index * 70}px)`,
            zIndex: 1000 - index,
          }}
        >
          <ToastNotification
            message={notification.message}
            isVisible={true}
            onClose={() => removeNotification(notification.id)}
            duration={notification.duration}
            type={notification.type}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer; 