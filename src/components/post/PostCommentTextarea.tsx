import commentsIcon from '../../assets/comments_icon2.svg';
import React from 'react';
import { createComment, updateComment } from '../../services/supabaseComments.ts';
import type { User } from '@supabase/supabase-js';
import styles from './postCommentTextarea.module.css';
import { useModal } from '../modal/ModalContext.ts';

const PostCommentTextarea = ({
    postId,
    fetchData,
    comment,
    handleCommentInput,
    user,
    type = 'create',
    commentId,
    onCancel,
}: {
    postId: string;
    fetchData: (post_id: string) => Promise<void>;
    comment: string;
    handleCommentInput: (comment: string) => void;
    user: User | null;
    type?: 'create' | 'update';
    commentId?: string;
    onCancel?: () => void;
}) => {
    const { openModal } = useModal();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?.id) {
            openModal('LOGIN');
            return;
        }

        if (comment.trim()) {
            let isSuccess = false;

            if (type === 'create') {
                const commentData = {
                    post_id: postId,
                    user_id: user.id,
                    content: comment,
                };
                isSuccess = await createComment(commentData);
            } else if (type === 'update' && commentId) {
                const commentData = {
                    id: commentId,
                    user_id: user.id,
                    content: comment,
                };
                isSuccess = await updateComment(commentData);
            }

            if (isSuccess) {
                handleCommentInput('');
                const message = type === 'create' ? '댓글이 등록되었습니다!' : '댓글이 수정되었습니다!';
                openModal('SUCCESS', undefined, message);
                fetchData(postId);
                if (type === 'update' && onCancel) {
                    onCancel();
                }
            }
        } else {
            handleCommentInput('');
        }
    };

    return (
        <form
            className={`${styles['comments__text-box']} ${type === 'update' && styles['comments__text-box-mt']}`}
            onSubmit={handleSubmit}
        >
            <textarea
                className={styles['comments__text']}
                id={comment}
                value={comment}
                onChange={e => handleCommentInput(e.target.value)}
                placeholder='댓글을 입력하세요'
            />
            <div className={styles['comments__text-bottom']}>
                <span className={styles['comments__text-count']}>{comment.length}/300</span>
                <div className={styles['comments__text-btn-group']}>
                    {type === 'update' && onCancel && (
                        <button type='button' onClick={onCancel} className={styles['comments__text-cancel-btn']}>
                            취소
                        </button>
                    )}
                    <button className={styles['comments__text-btn']} type='submit'>
                        {type === 'create' ? (
                            <img src={commentsIcon} alt='댓글 작성' />
                        ) : (
                            <img src={commentsIcon} alt='댓글 수정' />
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PostCommentTextarea;
