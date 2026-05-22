// hooks/useComments.ts

'use client';

import { useGet, useMutation } from '@/lib/client-swr';
import type { 
  Comment, 
  CommentsResponse, 
  AdminCommentsResponse,
  CreateCommentPayload, 
  ReplyCommentPayload,
  UpdateCommentStatusPayload 
} from '@/types/comment';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';

/**
 * هوک دریافت نظرات یک محصول/مقاله (سمت کاربر)
 */
export function useComments(targetType: string, targetId: string, page: number = 1) {
  return useGet<CommentsResponse>(
    `/comments?targetType=${targetType}&targetId=${targetId}&page=${page}`
  );
}

/**
 * هوک دریافت نظرات برای پنل مدیریت (ادمین)
 */
export function useAdminComments(status?: string, page: number = 1) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  params.append('page', page.toString());
  params.append('limit', '20');
  
  return useGet<AdminCommentsResponse>(`/admin/comments?${params.toString()}`);
}

/**
 * هوک ثبت نظر جدید
 */
export function useCreateComment() {
  const { post, isLoading, error } = useMutation('/comments');
  
  const createComment = async (payload: CreateCommentPayload) => {
    return post(payload);
  };
  
  return { createComment, isLoading, error };
}

/**
 * هوک پاسخ به نظر
 */
export function useReplyComment(commentId: string) {
  const { post, isLoading, error } = useMutation(`/comments/${commentId}/reply`);
  
  const reply = async (payload: ReplyCommentPayload) => {
    return post(payload);
  };
  
  return { reply, isLoading, error };
}

/**
 * هوک تغییر وضعیت نظر (برای ادمین)
 */
export function useUpdateCommentStatus(commentId: string) {
  const { put, isLoading, error } = useMutation(`/comments/${commentId}/status`);
  
  const updateStatus = async (payload: UpdateCommentStatusPayload) => {
    return put(payload);
  };
  
  return { updateStatus, isLoading, error };
}

/**
 * هوک حذف نظر (برای ادمین)
 */
export function useDeleteComment(commentId: string) {
  const { del, isLoading, error } = useMutation(`/comments/${commentId}`);
  
  const deleteComment = async () => {
    return del();
  };
  
  return { deleteComment, isLoading, error };
}