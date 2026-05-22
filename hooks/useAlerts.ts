// hooks/useAlerts.ts

'use client';

import { useApp } from '@/app/providers';
import { notify } from '@/utils/notify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';

export type Alert = {
  id: string;
  title: string;
  body: string;
  source: string;
  createdAt: number;
  isRead: boolean;
};

/**
 * هوک مدیریت اعلان‌ها (فقط عملیات، داده از Context میاد)
 */
export const useAlerts = () => {
  const { unreadCount, refetchAlerts } = useApp();

  // علامت گذاری یک اعلان با fetch مستقیم
  const markAsRead = async (alertId: string) => {
    try {
      const res = await fetch(`${API_URL}/alerts/${alertId}/read`, {
        method: 'POST',
        credentials: 'include',
      });
      const result = await res.json();
      
      if (result.success) {
        await refetchAlerts(); // به‌روزرسانی Context
        notify('اعلان با موفقیت خوانده شد', 'success');
      }
      return result;
    } catch (error) {
      notify('خطا در ثبت اعلان', 'error');
      return null;
    }
  };

  // علامت گذاری همه اعلان‌ها
  const markAllAsRead = async () => {
    try {
      const res = await fetch(`${API_URL}/alerts/read-all`, {
        method: 'POST',
        credentials: 'include',
      });
      const result = await res.json();
      
      if (result.success) {
        await refetchAlerts(); // به‌روزرسانی Context
        notify('همه اعلان‌ها با موفقیت خوانده شدند', 'success');
      }
      return result;
    } catch (error) {
      notify('خطا در ثبت اعلان‌ها', 'error');
      return null;
    }
  };

  return {
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: refetchAlerts,
  };
};