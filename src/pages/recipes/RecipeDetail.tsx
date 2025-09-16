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
import likeImg from '../../assets/like_icon.svg';
import likeActiveImg from '../../assets/like_icon_active.svg';
import dislikeImg from '../../assets/dislike_icon.svg';
import dislikeActiveImg from '../../assets/dislike_icon_active.svg';
import bookmarkIcon from '../../assets/bookmark_icon.svg';
import bookmarkActiveIcon from '../../assets/bookmark_icon_active.svg';
import {
    deleteBookmarkRecord,
    insertBookmarkRecord,
    selectBookmarksByUserIdPostId,
} from '../../services/supabasePostBookmark.ts';
import { useModal } from '../../components/modal/ModalContext.ts';

const RecipeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<PostWithUserNickname | null>(null);
    const [writerProfileImage, setWriterProfileImage] = useState<Tables<'files'>>();
    const [categoryName, setCategoryName] = useState<string>();
    const [userVoteType, setUserVoteType] = useState<VoteType | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const { user } = useUserStore();
    const { openModal } = useModal();

    const fetchData = async (id: string): Promise<void> => {
        const detail = await fetchPostWithUserNickname(id);

        if (detail) {
            setRecipe(detail);
            const category = await fetchCategory(detail.category_id);
            setCategoryName(category?.name || '없음');

            const writerProfileImage = await getUserProfileImage(detail.user_id);
            setWriterProfileImage(writerProfileImage);
        }

        if (user?.id) {
            const userVoteType = await getUserVoteStatus(id, user.id);
            setUserVoteType(userVoteType);

            const bookmarkStatus = await selectBookmarksByUserIdPostId(id, user.id);
            setIsBookmarked(bookmarkStatus);
        } else {
            setUserVoteType(null);
        }
    };

    const difficultyConvert = (difficulty: string | null | undefined): string => {
        switch (difficulty) {
            case 'top':
                return '상';
            case 'middle':
                return '중';
            case 'bottom':
                return '하';
            default:
                return '';
        }
    };

    const createAtConvert = (): string => {
        if (recipe?.created_at) {
            const date = new Date(recipe?.created_at);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}.${month}.${day}`;
        }
        return '';
    };

    const handleBookmark = async () => {
        if (!user?.id) {
            openModal('LOGIN');
            return;
        }

        if (id) {
            if (isBookmarked) {
                const result = await deleteBookmarkRecord(id, user.id);
                if (result) {
                    setIsBookmarked(false);
                }
            } else {
                const result = await insertBookmarkRecord(id, user.id);
                if (result) {
                    setIsBookmarked(true);
                }
            }
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
    }, [id, user?.id]);

    return (
        <div className={styles['recipe']}>
            <section className={styles['recipe__writer']}>
                <h2 className='sr-only'>작성자 프로필</h2>

                <div className={styles['profile-img-box']}>
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
                <ul className={styles['recipe__info']}>
                    <li>카테고리 : {categoryName}</li>
                    <li>난이도 : {difficultyConvert(recipe?.difficulty)}</li>
                    <li>요리시간 : {recipe?.cooking_time}분</li>
                    <li>{recipe?.servings}인분</li>
                </ul>
            </section>

            <section className={styles['recipe__ingredients']}>
                <h2>재료</h2>
                <p>{recipe?.ingredients}</p>
            </section>

            <section className={styles['recipe__content-box']}>
                <h2>레시피 설명</h2>
                <div className={styles['recipe__content']}>{recipe?.content}</div>

                <div className={styles['recipe__btn-box']}>
                    <div className={styles['recipe__like-btn-group']}>
                        <button
                            className={`${userVoteType === 'like' ? styles['recipe__like-btn--active'] : styles['recipe__like-btn']}`}
                            onClick={() => handleLike('like')}
                        >
                            <img
                                className={styles['recipe__like-img']}
                                src={userVoteType === 'like' ? likeActiveImg : likeImg}
                                alt='추천 버튼'
                            />
                            {recipe?.like_count}
                        </button>
                        <button className={styles['recipe__dislike-btn']} onClick={() => handleLike('dislike')}>
                            <img
                                className={`${userVoteType === 'like' ? styles['recipe__dislike-btn--active'] : styles['recipe__dislike-img']}`}
                                src={userVoteType === 'dislike' ? dislikeActiveImg : dislikeImg}
                                alt='비추천 버튼'
                            />
                            {recipe?.dislike_count}
                        </button>
                    </div>

                    <div className={styles['recipe__bookmark-box']}>
                        작성일자 : <time>{createAtConvert()}</time>
                        <button className={styles['recipe__bookmark__btn']} onClick={handleBookmark}>
                            <img src={isBookmarked ? bookmarkActiveIcon : bookmarkIcon} alt='북마크' />
                        </button>
                    </div>
                </div>
            </section>

            <section>{id && <PostComments postId={id} />}</section>
        </div>
    );
};

export default RecipeDetail;
