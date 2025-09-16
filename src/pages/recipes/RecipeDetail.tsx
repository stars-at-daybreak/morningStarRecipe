import { useEffect, useState } from 'react';
import { deletePost, fetchPostWithUserNickname } from '../../services/supabasePosts.ts';
import { useParams, useNavigate } from 'react-router-dom';
import PostComments from '../../components/PostComments.tsx';
import useUserStore from '../../stores/useUserStore.ts';
import type { PostWithUserNickname } from '../../types/posts.type.ts';
import { handlePostVote, getUserVoteStatus } from '../../services/supabasePostVotes.ts';
import type { VoteType } from '../../types/postVotes.type.ts';
import { getUserProfileImage } from '../../services/supabaseFiles.ts';
import type { Tables } from '../../types/supabase.ts';
import styles from './recipeDetail.module.css';
import noneProfile from '../../assets/none-profile.svg';
import LevelBadge from '../../components/LevelBadge/LevelBadge.tsx';
import { fetchCategory } from '../../services/supabaseCategories.ts';

const RecipeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<PostWithUserNickname | null>(null);
    const [writerProfileImage, setWriterProfileImage] = useState<Tables<'files'>>();
    const [categoryName, setCategoryName] = useState<string>();
    const [userVoteType, setUserVoteType] = useState<VoteType | null>(null);
    const { user } = useUserStore();

    const fetchData = async (id: string): Promise<void> => {
        const detail = await fetchPostWithUserNickname(id);

        if (detail) {
            setRecipe(detail);
            const category = await fetchCategory(detail?.category_id);
            setCategoryName(category?.name || '없음');
        }

        if (detail) {
            const writerProfileImage = await getUserProfileImage(detail?.user_id);
            setWriterProfileImage(writerProfileImage);
        }

        if (user?.id) {
            const userVoteType = await getUserVoteStatus(id, user.id);
            setUserVoteType(userVoteType);
        }
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
        }
    }, []);

    return (
        <div className={styles['recipe']}>
            <section className={styles['recipe__writer']}>
                <h2 className='sr-only'>작성자 프로필</h2>

                <div className={styles['profile-img']}>
                    {writerProfileImage ? (
                        <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/${writerProfileImage.filename}`}
                            alt='작성자 프로필 이미지'
                        />
                    ) : (
                        <img src={noneProfile} alt='작성자 프로필 이미지' />
                    )}
                </div>

                <span className={styles['recipe__writer-nickname']}>{recipe?.user_nickname}</span>
                <div className={styles['recipe__writer-badge']}>
                    <LevelBadge level={recipe?.current_level || 1} size='large' />
                </div>

                {user?.id === recipe?.user_id && (
                    <div className={styles['recipe__writer-btn']}>
                        <button onClick={handleUpdate}>수정</button>
                        <button onClick={handleDelete}>삭제</button>
                    </div>
                )}
            </section>

            <section className={styles['recipe__title']}>
                <h2>{recipe?.title}</h2>
                <span className='horizontal-line'></span>
                <ul className={styles['recipe__']}>
                    <li>카테고리 : {categoryName}</li>
                    <li>난이도</li>
                    <li>요리시간</li>
                    <li>인분</li>
                </ul>
            </section>

            <section className={styles['recipe__content']}>
                <p>{recipe?.content}</p>
            </section>

            <section>
                <button style={{ color: userVoteType === 'like' ? 'red' : '' }} onClick={() => handleLike('like')}>
                    추천{recipe?.like_count}
                </button>
                /
                <button
                    style={{ color: userVoteType === 'dislike' ? 'red' : '' }}
                    onClick={() => handleLike('dislike')}
                >
                    비추천{recipe?.dislike_count}
                </button>
            </section>

            <section>{id && <PostComments postId={id} />}</section>
        </div>
    );
};

export default RecipeDetail;
