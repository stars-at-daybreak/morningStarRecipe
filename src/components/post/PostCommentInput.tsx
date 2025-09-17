import commentsIcon from '../../assets/comments_icon.svg';
import React from 'react';
import { createComment } from '../../services/supabaseComments.ts';
import type { User } from '@supabase/supabase-js';
import styles from './postCommentInput.module.css';
import { useModal } from '../modal/ModalContext.ts';

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
    const { openModal } = useModal();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?.id) {
            openModal('LOGIN');
            return;
        }

        if (comment.trim()) {
            const commentData = {
                post_id: postId,
                user_id: user.id,
                content: comment,
            };

            const isSuccess = await createComment(commentData);

            if (isSuccess) {
                handleCommentInput('');
                openModal('SUCCESS', undefined, '댓글이 등록되었습니다!');
                fetchData(postId);
            }
        } else {
            handleCommentInput('');
        }
    };

    return (
        <form className={styles['comments__input-box']} onSubmit={handleSubmit}>
            <input
                className={styles['comments__input']}
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
