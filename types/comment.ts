// types/comment.ts

export type CommentStatus = 
  | 'در انتظار تایید' 
  | 'تایید شده' 
  | 'رد شده' 
  | 'منتظر پاسخ شما';

export type CommentReply = {
  id: string;
  txt: string;
  userName: string;
  createdAt: number;
};

export type Comment = {
  id: string;
  txt: string;
  star: number;
  status: CommentStatus;
  createdAt: number;
  userId: string;
  userName: string;
  replies: CommentReply[];
};

export type CommentTargetType = 'Product' | 'Article';

export type CreateCommentPayload = {
  txt: string;
  star: number;
  targetType: CommentTargetType;
  targetId: string;
};

export type ReplyCommentPayload = {
  txt: string;
};

export type UpdateCommentStatusPayload = {
  status: CommentStatus;
};

export type CommentsResponse = {
  items: Comment[];
  pagination: {
    page: number;
    limit: number;
  };
  success: boolean;
};

export type AdminCommentsResponse = {
  items: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
};