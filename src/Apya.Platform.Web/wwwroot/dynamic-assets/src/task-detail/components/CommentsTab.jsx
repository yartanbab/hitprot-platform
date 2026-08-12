import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Skeleton } from '../../components/ui';

export function CommentsTab({ taskId, task }) {
    const [text, setText] = useState('');
    const [replyToId, setReplyToId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const queryClient = useQueryClient();

    const comments = task?.comments ?? [];

    const handleAddComment = async (e) => {
        e?.preventDefault();
        if (!text.trim() || submitting) return;

        setSubmitting(true);
        try {
            await Promise.resolve(
                window.apya.platform.tasks.task.addComment(taskId, text.trim()),
            );
            setText('');
            queryClient.invalidateQueries({ queryKey: ['task-detail', taskId] });
            window?.abp?.notify?.success?.('Yorum eklendi.');
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Yorum eklenemedi.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (parentCommentId) => {
        if (!replyText.trim() || submitting) return;

        setSubmitting(true);
        try {
            await Promise.resolve(
                window.apya.platform.tasks.task.replyToComment(parentCommentId, replyText.trim()),
            );
            setReplyText('');
            setReplyToId(null);
            queryClient.invalidateQueries({ queryKey: ['task-detail', taskId] });
            window?.abp?.notify?.success?.('Yanıt eklendi.');
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Yanıt eklenemedi.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleAddComment} className="rounded-lg border border-default p-3 bg-surface-base">
                <textarea
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Bir yorum veya güncelleme yazın..."
                    className="w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
                />
                <div className="mt-2 flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!text.trim() || submitting}
                        isLoading={submitting}
                    >
                        Yorum Gönder
                    </Button>
                </div>
            </form>

            {comments.length === 0 ? (
                <div className="py-8 text-center text-sm text-text-tertiary">
                    Henüz yorum yapılmamış. İlk yorumu siz yazın!
                </div>
            ) : (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <div key={comment.id} className="rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2">
                            <div className="flex items-center justify-between text-xs text-text-secondary">
                                <span className="font-semibold text-text-primary">
                                    {comment.creatorUserName || comment.creatorName || 'Kullanıcı'}
                                </span>
                                <span>{comment.creationTime ? new Date(comment.creationTime).toLocaleString('tr-TR') : ''}</span>
                            </div>
                            <p className="text-sm text-text-primary whitespace-pre-wrap">{comment.text}</p>
                            
                            <div className="flex justify-end">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                                >
                                    Yanıtla
                                </Button>
                            </div>

                            {replyToId === comment.id && (
                                <div className="mt-2 pl-4 border-l-2 border-border-default space-y-2">
                                    <textarea
                                        rows={2}
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Yanıtınızı yazın..."
                                        className="w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => setReplyToId(null)}>İptal</Button>
                                        <Button variant="primary" size="sm" disabled={!replyText.trim() || submitting} onClick={() => handleReply(comment.id)}>Gönder</Button>
                                    </div>
                                </div>
                            )}

                            {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-3 pl-4 border-l-2 border-border-subtle space-y-2">
                                    {comment.replies.map((reply) => (
                                        <div key={reply.id} className="rounded bg-surface-base p-2 space-y-1">
                                            <div className="flex items-center justify-between text-xs text-text-tertiary">
                                                <span className="font-medium text-text-secondary">
                                                    {reply.creatorUserName || reply.creatorName || 'Kullanıcı'}
                                                </span>
                                                <span>{reply.creationTime ? new Date(reply.creationTime).toLocaleString('tr-TR') : ''}</span>
                                            </div>
                                            <p className="text-xs text-text-primary">{reply.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
