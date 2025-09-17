import { deleteComment, fetchCommentsWithUserNickname, updateComment } from '../../services/supabaseComments.ts';
import { useEffect, useState } from 'react';
import useUserStore from '../../stores/useUserStore.ts';
import type { CommentWithUserNickname } from '../../types/comments.type.ts';
import styles from './postComments.module.css';
import PostCommentInput from './PostCommentInput.tsx';
import LevelBadge from '../LevelBadge/LevelBadge.tsx';
import noneProfileImg from '../../assets/none-profile.svg';
import { commentCreatedTime } from '../../utils/utils.ts';

const PostComments = ({ postId }: { postId: string }) => {
    const [comments, setComments] = useState<CommentWithUserNickname[] | null>(null);
    const [comment, setComment] = useState('');
    const [updatedComment, setUpdatedComment] = useState('');
    const [commentId, setCommentId] = useState<string>('');
    const { user } = useUserStore();

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

    const handleUpdate = async (commentId: string, commentUserId: string) => {
        if (!user?.id) {
            alert('로그인이 필요합니다.');
            return;
        }
        if (user.id !== commentUserId) {
            alert('작성자만 수정이 가능합니다.');
            return;
        }

        const commentData = {
            id: commentId,
            user_id: user.id,
            content: updatedComment,
        };

        const isSuccess = await updateComment(commentData);

        if (isSuccess) {
            alert('댓글 저장을 완료하였습니다');
            setUpdatedComment('');
            fetchData(postId);
        }
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

    const handleCommentInput = (comment: string) => {
        setComment(comment);
    };

    useEffect(() => {
        if (postId) {
            fetchData(postId);
        }
    }, []);

    return (
        <div className={styles['comments']}>
            <div>
                <PostCommentInput
                    postId={postId}
                    fetchData={fetchData}
                    comment={comment}
                    handleCommentInput={handleCommentInput}
                    user={user}
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
                                        {updatedComment && commentId ? (
                                            <button
                                                type='button'
                                                onClick={() => handleUpdate(comment.id, comment.user_id)}
                                            >
                                                수정완료
                                            </button>
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
                                <input
                                    className={styles['comments__item-content--update']}
                                    type='text'
                                    value={updatedComment}
                                    onChange={e => setUpdatedComment(e.target.value)}
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
