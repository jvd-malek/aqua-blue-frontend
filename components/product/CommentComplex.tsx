// components/product/CommentComplex.tsx

'use client';

import { useState } from 'react';
import { MessageSquare, Star, Send } from 'lucide-react';
import { useGet, useMutation } from '@/lib/client-swr';
import { notify } from '@/utils/notify';
import { formatDate } from '@/utils/dateFormatter';

type Comment = {
  id: string;
  txt: string;
  star: number;
  status: string;
  createdAt: number;
  userId: string;
  userName: string;
  replies?: Reply[];
};

type Reply = {
  id: string;
  txt: string;
  userName: string;
  createdAt: number;
};

type Props = {
  targetType: 'Product' | 'Article';
  targetId: string;
};

export default function CommentComplex({ targetType, targetId }: Props) {
  const [page, setPage] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [newStar, setNewStar] = useState(5);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const { data, mutate, isLoading } = useGet<{ items: Comment[]; pagination: any }>(
    `/comments?targetType=${targetType}&targetId=${targetId}&page=${page}&limit=10`
  );

  const { post: createComment, isLoading: isSending } = useMutation('/comments');
  const { post: createReply } = useMutation(`/comments/${replyTo}/reply`);

  const comments = data?.items || [];
  const totalPages = data?.pagination?.limit ? Math.ceil((data?.pagination?.total || 0) / 10) : 1;

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    const res = await createComment({ txt: newComment, star: newStar, targetType, targetId });
    if (res?.success) {
      notify('نظر شما با موفقیت ثبت شد و پس از تأیید نمایش داده می‌شود', 'success');
      setNewComment('');
      setNewStar(5);
      mutate();
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    const res = await createReply({ txt: replyText });
    if (res?.success) {
      notify('پاسخ شما با موفقیت ثبت شد', 'success');
      setReplyTo(null);
      setReplyText('');
      mutate();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6" id="comments">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <MessageSquare size={20} /> دیدگاه‌ها
      </h3>

      {/* New Comment Form */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="دیدگاه خود را بنویسید..."
          rows={3}
          className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setNewStar(s)} type="button">
                <Star size={16} className={s <= newStar ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'} />
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSending}
            className="flex items-center gap-1 bg-linear-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-all disabled:opacity-50"
          >
            <Send size={14} /> ارسال نظر
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            {/* Comment Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                  {comment.userName?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{comment.userName}</p>
                  <p className="text-xs text-gray-400">{formatDate(comment.createdAt)}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} className={s <= comment.star ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-600'} />
                ))}
              </div>
            </div>

            {/* Comment Text */}
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-6">{comment.txt}</p>

            {/* Reply Button */}
            <button
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              className="text-xs text-blue-500 hover:text-blue-600 mt-2 flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              پاسخ
            </button>

            {/* Reply Form */}
            {replyTo === comment.id && (
              <div className="mt-3 mr-6">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="پاسخ خود را بنویسید..."
                  rows={2}
                  className="w-full p-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setReplyTo(null)} className="text-xs px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700">انصراف</button>
                  <button onClick={() => handleReply(comment.id)} className="text-xs px-3 py-1 rounded-lg bg-blue-600 text-white">ارسال پاسخ</button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 mr-6 space-y-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-r-2 border-blue-400">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{reply.userName}</span>
                      <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{reply.txt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {!isLoading && comments.length === 0 && (
          <p className="text-center text-gray-400 py-8">هنوز دیدگاهی ثبت نشده است. اولین نفری باشید که نظر می‌دهید!</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4" dir="ltr">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}