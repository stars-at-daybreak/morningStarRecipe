import { useEffect, useState } from 'react';
import { deletePost, fetchPostWithUserNickname } from '../services/supabasePosts.ts';
import { useParams, useNavigate } from 'react-router-dom';
import PostComments from './post/PostComments.tsx';
import useUserStore from '../stores/useUserStore.ts';
import type { PostWithUserNickname } from '../types/posts.type.ts';

const ShareDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [share, setShare] = useState<PostWithUserNickname | null>(null);
    const { user } = useUserStore();

    const fetchData = async (id: string): Promise<void> => {
        const detail = await fetchPostWithUserNickname(id);
        setShare(detail);
    };

    const handleUpdate = () => {
        if (id) {
            navigate('/share/form', {
                state: { type: 'update', shareId: id },
            });
        }
    };

    const handleDelete = async () => {
        if (id && user?.id) {
            const isSuccess = await deletePost(id, user.id);
            if (isSuccess) {
                alert('삭제가 완료되었습니다.');
                navigate('/share');
            }
        }
    };

    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, []);

    return (
        <div>
            {user?.id === share?.user_id && <button onClick={handleUpdate}>게시물 수정</button>}
            {user?.id === share?.user_id && <button onClick={handleDelete}>게시물 삭제</button>}
            <h2>{share?.title}</h2>
            <p>
                {share?.user_nickname}
                {share?.user_level_title || 'LV.1 초보 집밥러'}
            </p>
            <p>{share?.content}</p>
            {id && <PostComments postId={id} />}
        </div>
    );
};

export default ShareDetail;
