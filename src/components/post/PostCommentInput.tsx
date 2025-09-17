import commentsIcon from '../../assets/comments_icon.svg';
import React from 'react';
import { createComment } from '../../services/supabaseComments.ts';
import type { User } from '@supabase/supabase-js';
import styles from './postCommentInput.module.css';

const PostCommentInput = ({
    postId,
    fetchData,
    comment,
    handleCommentInput,
    user,
}: {
    postId: string;
    fetchData: (post_id: string) => Promise<void>;
    comment: string;
    handleCommentInput: (comment: string) => void;
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

        const isSuccess = await createComment(commentData);

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
                onChange={e => handleCommentInput(e.target.value)}
                placeholder='댓글을 입력하세요'
            />
            <button className={styles['comments__input-btn']} type='submit'>
                <img src={commentsIcon} alt='댓글 작성' />
            </button>
        </form>
    );
};

export default PostCommentInput;
