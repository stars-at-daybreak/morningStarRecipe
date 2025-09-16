import commentsIcon from '../../assets/comments_icon.svg';
import React from 'react';
import { createComment, updateComment } from '../../services/supabaseComments.ts';
import type { User } from '@supabase/supabase-js';
import styles from './postCommentInput.module.css';

const PostCommentInput = ({
    postId,
    type,
    fetchData,
    commentId,
    comment,
    handleComment,
    user,
}: {
    postId: string;
    type: string;
    fetchData: (post_id: string) => Promise<void>;
    commentId: string;
    comment: string;
    handleComment: (comment: string) => void;
    user: User | null;
}) => {
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

    return (
        <form className={styles['comments__input-box']} onSubmit={handleSubmit}>
            <label htmlFor='comment' className='sr-only'>
                댓글 입력
            </label>
            <input
                className={styles['comments__input']}
                type='text'
                id={comment}
                value={comment}
                onChange={e => handleComment(e.target.value)}
                placeholder='댓글을 입력하세요'
            />
            <button className={styles['comments__input-btn']} type='submit'>
                <img src={commentsIcon} alt='댓글 작성' />
            </button>
        </form>
    );
};

export default PostCommentInput;
