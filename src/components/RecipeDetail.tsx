import { useEffect, useState } from 'react';
import { deletePost, fetchPostWithUserNickname } from '../services/supabasePosts.ts';
import { useParams, useNavigate } from 'react-router-dom';
import PostComments from './PostComments.tsx';
import useUserStore from '../stores/useUserStore.ts';
import type { PostWithUserNickname } from '../types/posts.type.ts';

const RecipeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<PostWithUserNickname | null>(null);
    const { user } = useUserStore();

    const fetchData = async (id: string): Promise<void> => {
        const data = await fetchPostWithUserNickname(id);
        setRecipe(data);
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
                navigate('/recipes'); // 레시피 목록으로 이동
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
            {user?.id === recipe?.user_id && <button onClick={handleUpdate}>게시물 수정</button>}
            {user?.id === recipe?.user_id && <button onClick={handleDelete}>게시물 삭제</button>}
            <h2>{recipe?.title}</h2>
            <p>{recipe?.user_nickname}</p>
            <p>{recipe?.content}</p>
            {id && <PostComments postId={id} />}
        </div>
    );
};

export default RecipeDetail;
