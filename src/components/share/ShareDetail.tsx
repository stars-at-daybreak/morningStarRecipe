import { useEffect, useState } from 'react';
import { deletePost, fetchPostWithUserNickname } from '../../services/supabasePosts.ts';
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

    // 📍 타입 수정: string | undefined 허용
    interface ContentRendererProps {
        htmlContent: string | undefined | null;
        className?: string;
        fallback?: React.ReactNode;
    }

    const ContentRenderer: React.FC<ContentRendererProps> = ({
        htmlContent,
        className = '',
        fallback = <p>내용이 없습니다.</p>,
    }) => {
        // htmlContent가 없거나 빈 문자열인 경우
        if (!htmlContent || htmlContent.trim() === '') {
            return <div className={`content-renderer ${className}`}>{fallback}</div>;
        }

        return <div className={`content-renderer ${className}`} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
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
                {share?.user_nickname} {share?.user_level_title || 'LV.1 초보 집밥러'}
            </p>

            <ContentRenderer htmlContent={share?.content} className='post-content' fallback={<p>내용이 없습니다.</p>} />

            {id && <PostComments postId={id} />}
        </div>
    );
};

export default ShareDetail;
