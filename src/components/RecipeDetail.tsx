import { useEffect, useState } from 'react';
import { deletePost, fetchPostWithUserNickname } from '../services/supabasePosts.ts';
import { useParams, useNavigate } from 'react-router-dom';
import PostComments from './PostComments.tsx';
import useUserStore from '../stores/useUserStore.ts';
import type { PostWithUserNickname } from '../types/posts.type.ts';
import { handlePostVote, getUserVoteStatus } from '../services/supabasePostVotes.ts';
import type { VoteType } from '../types/postVotes.type.ts';
import { getPostThumbnails } from '../services/supabaseFiles.ts';

const RecipeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<PostWithUserNickname | null>(null);
    const [userVoteType, setUserVoteType] = useState<VoteType | null>(null);
    const [thumbnail, setThumbnail] = useState('');
    const { user } = useUserStore();
    const apiUrl: string = import.meta.env.VITE_API_BASE_URL;

    const fetchData = async (id: string): Promise<void> => {
        const detail = await fetchPostWithUserNickname(id);
        setRecipe(detail);
        if (user?.id) {
            const userVoteType = await getUserVoteStatus(id, user?.id);
            setUserVoteType(userVoteType);
        }
    };

    const fetchThumbnail = async (id: string) => {
        const { filename } = await getPostThumbnails(id);
        setThumbnail(filename);
        console.log(filename);
    };

    const handleUpdate = () => {
        if (id) {
            navigate('/recipes/form', {
                state: { type: 'update', recipeId: id },
            });
        }
    };

    const handleDelete = async () => {
        if (id && user?.id) {
            const isSuccess = await deletePost(id, user.id);
            if (isSuccess) {
                alert('삭제가 완료되었습니다.');
                navigate('/recipes');
            }
        }
    };

    const handleLike = async (type: 'like' | 'dislike') => {
        if (!user?.id || !id) {
            alert('로그인이 필요합니다.');
            return;
        }

        const success = await handlePostVote(id, user.id, type);
        if (success) {
            await fetchData(id);
        } else {
            alert('투표 처리 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        if (id) {
            fetchData(id);
            fetchThumbnail(id);
        }
    }, []);

    return (
        <div>
            {user?.id === recipe?.user_id && (
                <>
                    <button onClick={handleUpdate}>게시물 수정</button>/
                    <button onClick={handleDelete}>게시물 삭제</button>
                </>
            )}
            {thumbnail && <img src={`${apiUrl}/${thumbnail}`} alt='썸네일' crossOrigin='anonymous' />}
            <h2>{recipe?.title}</h2>
            <p>
                {recipe?.user_nickname}
                {recipe?.user_level_title || 'LV.1 초보 집밥러'}
            </p>
            <p>{recipe?.content}</p>
            <button style={{ color: userVoteType === 'like' ? 'red' : '' }} onClick={() => handleLike('like')}>
                추천{recipe?.like_count}
            </button>
            /
            <button style={{ color: userVoteType === 'dislike' ? 'red' : '' }} onClick={() => handleLike('dislike')}>
                비추천{recipe?.dislike_count}
            </button>
            {id && <PostComments postId={id} />}
        </div>
    );
};

export default RecipeDetail;
