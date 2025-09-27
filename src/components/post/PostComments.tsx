import { deleteComment, fetchCommentsWithUserNickname, updateComment } from '../../services/supabaseComments.ts';
import { useEffect, useState } from 'react';
import useUserStore from '../../stores/useUserStore.ts';
import type { CommentWithUserNickname } from '../../types/comments.type.ts';
import styles from './postComments.module.css';
import PostCommentTextarea from './PostCommentTextarea.tsx';
import LevelBadge from '../levelBadge/LevelBadge.tsx';
import noneProfileImg from '../../assets/none-profile.svg';
import { commentCreatedTime } from '../../utils/utils.ts';
import { useModal } from '../modal/ModalContext.ts';

const PostComments = ({ postId }: { postId: string }) => {
    const [comments, setComments] = useState<CommentWithUserNickname[] | null>(null);
    const [comment, setComment] = useState('');
    const [updatedComment, setUpdatedComment] = useState('');
    const [commentId, setCommentId] = useState<string>('');
    const { user } = useUserStore();
    const { openModal } = useModal();
    const COMMENT_MAX_LENGTH = 300;

    const fetchData = async (post_id: string): Promise<void> => {
        const data = await fetchCommentsWithUserNickname(post_id);
        if (data) {
            const newComments = data.map(item => ({
                ...item,
                created_at: commentCreatedTime(String(item.created_at)),
            }));

            setComments(newComments);
        }
    };

    const handleOpenUpdateInput = (commentId: string, comment: string) => {
        setCommentId(commentId);
        setUpdatedComment(comment);
    };

    const handleDelete = async (commentId: string) => {
        if (!user?.id) {
            openModal('LOGIN');
            return;
        }

        openModal('DELETE', async () => {
            const isSuccess = await deleteComment(commentId, user.id);
            if (isSuccess) {
                fetchData(postId);
            }
        });
    };

    const handleCommentInput = (comment: string) => {
        if (comment.length <= COMMENT_MAX_LENGTH) {
            setComment(comment);
        }
    };

    const handleUpdatedCommentInput = (comment: string) => {
        if (comment.length <= COMMENT_MAX_LENGTH) {
            setUpdatedComment(comment);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchData(postId);
        }
    }, []);

    return (
        <div className={styles['comments']}>
            <div>
                <PostCommentTextarea
                    postId={postId}
                    fetchData={fetchData}
                    comment={comment}
                    handleCommentInput={handleCommentInput}
                    user={user}
                    COMMENT_MAX_LENGTH={COMMENT_MAX_LENGTH}
                />
            </div>
            <div className={styles['comments__list-box']}>
                <ul className={styles['comments__list']}>
                    {comments?.map(comment => (
                        <li className={styles['comments__list-item']} key={comment.id}>
                            <div className={styles['comments__item-header']}>
                                <div className={styles['comments__item-profile']}>
                                    <div className={styles['comments__item-profile-img-box']}>
                                        {comment.user_profile_img ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_BASE_URL}/${comment.user_profile_img}`}
                                                alt='프로필 이미지'
                                                crossOrigin='anonymous'
                                            />
                                        ) : (
                                            <img src={noneProfileImg} alt='기본 프로필 이미지' />
                                        )}
                                    </div>
                                    <span className={styles['comments__item-profile-nickname']}>
                                        {comment.user_nickname}
                                    </span>
                                    <LevelBadge level={comment?.current_level || 1} size='small' />
                                    <time className={styles['comments__time']}>{comment.created_at}</time>
                                </div>
                                {user?.id === comment.user_id && (
                                    <div className={styles['comments__item-btn-group']}>
                                        {updatedComment && commentId === comment.id ? (
                                            <></>
                                        ) : (
                                            <>
                                                <button
                                                    className={styles['comments__item-update-btn']}
                                                    type='button'
                                                    onClick={() => handleOpenUpdateInput(comment.id, comment.content)}
                                                >
                                                    수정
                                                </button>
                                                <button type='button' onClick={() => handleDelete(comment.id)}>
                                                    삭제
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {updatedComment && commentId === comment.id ? (
                                <PostCommentTextarea
                                    postId={postId}
                                    fetchData={fetchData}
                                    comment={updatedComment}
                                    handleCommentInput={handleUpdatedCommentInput}
                                    user={user}
                                    type='update'
                                    commentId={comment.id}
                                    onCancel={() => {
                                        setUpdatedComment('');
                                        setCommentId('');
                                    }}
                                    COMMENT_MAX_LENGTH={COMMENT_MAX_LENGTH}
                                />
                            ) : (
                                <div className={styles['comments__item-content']}>{comment.content}</div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PostComments;
