import { useEffect, useState } from 'react';
import { fetchPost } from '../services/supabasePosts.ts';
import { useParams } from 'react-router-dom';
import type { RecipePost } from '../types/myPosts.types.ts';
import PostComments from './PostComments.tsx';

const RecipeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<RecipePost | null>(null);

    const fetchData = async (id: string): Promise<void> => {
        const data = await fetchPost(id);
        setRecipe(data);
    };

    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, []);

    return (
        <div>
            <h2>{recipe?.title}</h2>
            <p>{recipe?.content}</p>
            {id && <PostComments postId={id} />}
        </div>
    );
};

export default RecipeDetail;
