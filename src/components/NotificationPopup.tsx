import React from 'react';
// [converted from react-native] import { div, span, Scrolldiv, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore } from '../state/useProductStore';
import { Notification } from '../types/product';

interface NotificationPopupProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationPopup: React.FC<NotificationPopupProps> = ({ visible, onClose }) => {
  const { getActiveNotifications, markNotificationAsRead, clearOldNotifications } = useProductStore();
  
  // Clean up old notifications when popup opens
  React.useEffect(() => {
    if (visible) {
      clearOldNotifications();
    }
  }, [visible, clearOldNotifications]);

  const activeNotifications = getActiveNotifications();
  
  // Debug logging
  React.useEffect(() => {
    if (visible) {
      console.log('📧 Notification Popup opened');
      console.log('📧 Active notifications count:', activeNotifications.length);
      console.log('📧 All notifications:', activeNotifications);
      activeNotifications.forEach((notification, index) => {
        console.log(`📧 Notification ${index + 1}:`, {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          isRead: notification.isRead,
          createdAt: notification.createdAt
        });
      });
    }
  }, [visible, activeNotifications]);

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getNotificationIcon = (type: string = 'info') => {
    switch (type) {
      case 'warning': return { name: 'warning' as const, color: '#f59e0b' };
      case 'success': return { name: 'checkmark-circle' as const, color: '#10b981' };
      case 'announcement': return { name: 'megaphone' as const, color: '#3b82f6' };
      default: return { name: 'information-circle' as const, color: '#6b7280' };
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <div className="flex-1 bg-black/50">
        {/* Top spacer */}
        <Pressable className="flex-1" onPress={onClose} />
        
        {/* Notification Panel */}
        <div className="bg-white rounded-t-xl">
          {/* Header */}
          <div className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <span className="text-lg font-bold text-gray-900">Notifications</span>
            <Pressable onPress={onClose} className="p-1">
              <Ionicons name="close" size={24} color="#6b7280" />
            </Pressable>
          </div>

          {/* Notifications List */}
          <div style={{ height: 350 }}>
            <Scrolldiv className="flex-1" showsVerticalScrollIndicator={true}>
              {activeNotifications.length === 0 ? (
                <div className="items-center justify-center py-12">
                  <Ionicons name="notifications-outline" size={48} color="#d1d5db" />
                  <span className="text-gray-500 mt-2">No notifications</span>
                  <span className="text-gray-400 text-xs mt-1">Create one in Admin → Notify</span>
                </div>
              ) : (
                activeNotifications.map((notification, index) => {
                  const icon = getNotificationIcon(notification.type);
                  console.log(`Rendering notification ${index}:`, notification.title);
                  return (
                    <Pressable
                      key={notification.id}
                      onPress={() => handleNotificationPress(notification)}
                      className={`p-4 border-b border-gray-100 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex-row items-start">
                        <Ionicons name={icon.name} size={20} color={icon.color} />
                        
                        <div className="flex-1 ml-3">
                          <div className="flex-row items-center justify-between mb-1">
                            <span className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.createdAt)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600 leading-relaxed">
                            {notification.message}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full absolute -left-7 top-1" />
                          )}
                        </div>
                      </div>
                    </Pressable>
                  );
                })
              )}
            </Scrolldiv>
          </div>
        </div>
      </div>
    </Modal>
  );
};