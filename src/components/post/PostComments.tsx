import { deleteComment, fetchCommentsWithUserNickname } from '../../services/supabaseComments.ts';
import { useEffect, useState } from 'react';
import useUserStore from '../../stores/useUserStore.ts';
import type { CommentWithUserNickname } from '../../types/comments.type.ts';
import styles from './postComments.module.css';
import PostCommentInput from './PostCommentInput.tsx';

const PostComments = ({ postId }: { postId: string }) => {
    const [comments, setComments] = useState<CommentWithUserNickname[] | null>(null);
    const [comment, setComment] = useState('');
    const [type, setType] = useState<'create' | 'update'>('create');
    const [commentId, setCommentId] = useState<string>('');
    const { user } = useUserStore();

    const fetchData = async (post_id: string): Promise<void> => {
        const data = await fetchCommentsWithUserNickname(post_id);
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

    const handleComment = (comment: string) => {
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
                    type={type}
                    fetchData={fetchData}
                    commentId={commentId}
                    comment={comment}
                    handleComment={handleComment}
                    user={user}
                />
            </div>
            <ul className={styles['comments__list']}>
                {comments?.map(comment => (
                    <li key={comment.id}>
                        {comment.content}
                        <p>
                            닉네임: {comment.user_nickname}레벨: {comment?.user_level_title}
                        </p>
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
