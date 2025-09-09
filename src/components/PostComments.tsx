import { createComment, deleteComment, fetchComments, updateComment } from '../services/supabaseComments.ts';
import React, { useEffect, useState } from 'react';
import type { Tables } from '../types/supabase.ts';
import useUserStore from '../stores/useUserStore.ts';

const PostComments = ({ postId }: { postId: string }) => {
    const [comments, setComments] = useState<Tables<'comments'>[] | null>(null);
    const [comment, setComment] = useState('');
    const [type, setType] = useState<'create' | 'update'>('create');
    const [commentId, setCommentId] = useState<string>('');
    const { user } = useUserStore();

    const fetchData = async (post_id: string): Promise<void> => {
        const data = await fetchComments(post_id);
        setComments(data);
    };

    const handleUpdate = (commentId: string, comment: string) => {
        setType('update');
        setCommentId(commentId);
        setComment(comment);
    };

    const handleDelete = async (commentId: string) => {
        if (!user?.id) {
            alert('로그인이 필요합니다.');
            return;
        }

        const isSuccess = await deleteComment(commentId, user.id);
        if (isSuccess) {
            alert('댓글 삭제를 완료하였습니다');
            fetchData(postId);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?.id) {
            alert('로그인이 필요합니다.');
            return;
        }

        const commentData = {
            post_id: postId,
            user_id: user.id,
            content: comment,
        };

        let isSuccess;
        if (type === 'update') {
            isSuccess = await updateComment({ ...commentData, id: commentId });
        } else {
            isSuccess = await createComment(commentData);
        }

        if (isSuccess) {
            alert('댓글 저장을 완료하였습니다');
            fetchData(postId);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchData(postId);
        }
    }, []);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor='comment'>댓글</label>
                <input type='text' id={comment} value={comment} onChange={e => setComment(e.target.value)} />
                <button type='submit'>댓글작성</button>
            </form>
            <ul>
                {comments?.map(comment => (
                    <li key={comment.id}>
                        {comment.content}
                        <button type='button' onClick={() => handleUpdate(comment.id, comment.content)}>
                            수정
                        </button>
                        <button type='button' onClick={() => handleDelete(comment.id)}>
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostComments;
