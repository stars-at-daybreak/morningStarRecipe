import React, { useState } from 'react';
import { createPost, updatePost } from '../../services/supabasePosts.ts';
import useUserStore from '../../stores/useUserStore.ts';
import { useLocation } from 'react-router-dom';
import { ResponsiveFileUpload } from '../../components/ImgUpload/ImgUpload.tsx';
import { saveThumbnailImage } from '../../services/supabaseFiles.ts';

const RecipeForm = () => {
    const location = useLocation();
    const { type, recipeId } = location.state || { type: 'create' };
    const [formData, setFormData] = useState({
        title: '',
        category_id: '7ddc5ac7-0105-4d9d-be47-46f3ea5f95ba',
        difficulty: 'middle' as 'top' | 'middle' | 'bottom',
        cooking_time: 10,
        servings: 1,
        ingredients: '',
        content: '',
    });
    const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
    const { user } = useUserStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?.id) {
            alert('로그인이 필요합니다.');
            return;
        }

        const recipeData = {
            ...formData,
            post_type: 'recipe' as const,
            user_id: user.id,
        };

        try {
            if (type === 'create') {
                const postId = await createPost(recipeData);

                if (postId && uploadedFilename) {
                    await saveThumbnailImage(uploadedFilename, postId);
                }

                if (postId) {
                    alert('레시피 저장을 완료하였습니다.');
                } else {
                    alert('레시피 저장에 실패했습니다.');
                }
            } else if (type === 'update' && recipeId) {
                const isSuccess = await updatePost({ ...recipeData, id: recipeId });

                if (isSuccess && uploadedFilename) {
                    await saveThumbnailImage(uploadedFilename, recipeId);
                }

                if (isSuccess) {
                    alert('레시피 수정을 완료하였습니다.');
                } else {
                    alert('레시피 수정에 실패했습니다.');
                }
            }
        } catch (error) {
            console.error('레시피 저장 실패:', error);
            alert('레시피 저장 중 오류가 발생했습니다.');
        }
    };

    const handleFileUpload = (filename: string | null) => {
        setUploadedFilename(filename);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='title'>제목:</label>
                    <input
                        type='text'
                        id='title'
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor='category'>카테고리:</label>
                    <select
                        name='category'
                        id='category'
                        value={formData.category_id}
                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                    >
                        <option value='7ddc5ac7-0105-4d9d-be47-46f3ea5f95ba'>한식</option>
                    </select>

                    <label htmlFor='difficulty'>난이도:</label>
                    <select
                        name='difficulty'
                        id='difficulty'
                        value={formData.difficulty}
                        onChange={e =>
                            setFormData({ ...formData, difficulty: e.target.value as 'top' | 'middle' | 'bottom' })
                        }
                    >
                        <option value='top'>상</option>
                        <option value='middle'>중</option>
                        <option value='bottom'>하</option>
                    </select>

                    <label htmlFor='cooking_time'>요리시간:</label>
                    <select
                        name='cooking_time'
                        id='cooking_time'
                        value={formData.cooking_time}
                        onChange={e => setFormData({ ...formData, cooking_time: Number(e.target.value) })}
                    >
                        <option value='10'>10분</option>
                        <option value='20'>20분</option>
                        <option value='30'>30분</option>
                    </select>

                    <label htmlFor='servings'>인원:</label>
                    <select
                        name='servings'
                        id='servings'
                        value={formData.servings}
                        onChange={e => setFormData({ ...formData, servings: Number(e.target.value) })}
                    >
                        <option value='1'>1인분</option>
                        <option value='2'>2인분</option>
                        <option value='3'>3인분</option>
                    </select>
                </div>

                <div>
                    <label htmlFor='ingredients'>재료</label>
                    <input
                        type='text'
                        id='ingredients'
                        value={formData.ingredients}
                        onChange={e => setFormData({ ...formData, ingredients: e.target.value })}
                    />
                </div>
                <div>
                    <textarea
                        name='content'
                        id='content'
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                    ></textarea>
                </div>

                <ResponsiveFileUpload onFileUpload={handleFileUpload} />

                <button type='submit'>작성 완료</button>
            </form>
        </div>
    );
};

export default RecipeForm;
