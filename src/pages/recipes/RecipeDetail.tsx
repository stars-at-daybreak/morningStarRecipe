import { useEffect, useState } from 'react';
import { deletePost, fetchPostWithUserNickname } from '../../services/supabasePosts.ts';
import { useNavigate, useParams } from 'react-router-dom';
import PostComments from '../../components/post/PostComments.tsx';
import useUserStore from '../../stores/useUserStore.ts';
import type { PostWithUserNickname } from '../../types/posts.type.ts';
import { getUserVoteStatus, handlePostVote } from '../../services/supabasePostVotes.ts';
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
import {
    deleteBookmarkRecord,
    insertBookmarkRecord,
    selectBookmarksByUserIdPostId,
} from '../../services/supabasePostBookmark.ts';
import { useModal } from '../../components/modal/ModalContext.ts';
import { formatDateToString } from '../../utils/utils.ts';
import { usePageSetup } from '../../hooks/usePageSetup.tsx';
import LexicalRenderer from '../../components/LexicalEditor/LexicalRenderer.tsx';

interface VoteCounts {
    prevType: null | 'like' | 'dislike';
    likeCount: number;
    dislikeCount: number;
}

const RecipeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<PostWithUserNickname | null>(null);
    const [voteCounts, setVoteCounts] = useState<VoteCounts>({ prevType: null, likeCount: 0, dislikeCount: 0 });
    const [writerProfileImage, setWriterProfileImage] = useState<Tables<'files'>>();
    const [categoryName, setCategoryName] = useState<string>();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const { user } = useUserStore();
    const { openModal } = useModal();

    usePageSetup({
        title: '모두의 레시피',
        pageName: 'recipeDetail',
        showBackButton: true,
    });

    const fetchData = async (id: string): Promise<void> => {
        const detail = await fetchPostWithUserNickname(id);

        if (detail) {
            if (detail.created_at) {
                detail.created_at = formatDateToString(detail.created_at);
            }

            setRecipe(detail);
            const category = await fetchCategory(detail.category_id);
            setCategoryName(category?.name || '없음');

            const writerProfileImage = await getUserProfileImage(detail.user_id);
            setWriterProfileImage(writerProfileImage);
        }

        if (user?.id) {
            const userVoteType = await getUserVoteStatus(id, user.id);

            setVoteCounts({
                prevType: userVoteType,
                likeCount: detail?.like_count || 0,
                dislikeCount: detail?.dislike_count || 0,
            });

            const bookmarkStatus = await selectBookmarksByUserIdPostId(id, user.id);
            setIsBookmarked(bookmarkStatus);
        } else {
            setVoteCounts({
                prevType: null,
                likeCount: detail?.like_count || 0,
                dislikeCount: detail?.dislike_count || 0,
            });
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
            openModal('DELETE', async () => {
                const isSuccess = await deletePost(id, user.id);
                if (isSuccess) {
                    navigate('/recipes');
                }
            });
        }
    };

    const updateVoteCounts = (changeType: 'like' | 'dislike'): VoteCounts => {
        const isSameType = voteCounts.prevType === changeType;
        const isOppositeType = voteCounts.prevType && voteCounts.prevType !== changeType;

        return {
            prevType: isSameType ? null : changeType,
            likeCount: voteCounts.likeCount + (changeType === 'like' ? (isSameType ? -1 : 1) : isOppositeType ? -1 : 0),
            dislikeCount:
                voteCounts.dislikeCount + (changeType === 'dislike' ? (isSameType ? -1 : 1) : isOppositeType ? -1 : 0),
        };
    };

    const handleLike = async (changeType: 'like' | 'dislike') => {
        if (!user?.id || !id) {
            openModal('LOGIN');
            return;
        }

        const success = await handlePostVote(id, user.id, changeType);
        if (success) {
            setVoteCounts(updateVoteCounts(changeType));
            // await fetchData(id);
        } else {
            openModal('FAIL', undefined, '투표 처리 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, [id, user?.id]);

    return (
        <>
            <title>모두의 레시피 - 모두의 부엌</title>
            <meta name='description' content='맛있는 집밥 레시피를 확인하고 따라 만들어보세요.' />
            <meta
                name='keywords'
                content={`${recipe?.title || '레시피'}, 요리법, 집밥, '요리', ${recipe?.difficulty || ''}, 모두의부엌`}
            />
            <meta property='og:title' content='모두의 레시피 - 모두의 부엌' />
            <meta property='og:description' content='맛있는 집밥 레시피를 확인하고 따라 만들어보세요.' />
            <meta property='og:image' content='https://morningstarrecipe.netlify.app/assets/og_image.png' />
            <meta property='og:type' content='article' />
            <meta property='og:url' content={`https://morningstarrecipe.netlify.app/recipes/${recipe?.id}`} />
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content={recipe?.title || '레시피 - 모두의 부엌'} />
            <meta name='twitter:description' content='맛있는 집밥 레시피를 확인하고 따라 만들어보세요.' />
            <meta name='twitter:image' content='https://morningstarrecipe.netlify.app/assets/og_image.png' />
            <meta name='robots' content='index, follow' />
            <link rel='canonical' href={`https://morningstarrecipe.netlify.app/recipes/${recipe?.id}`} />

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
                            <div className={styles['profile-default']} />
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
                    <div className={styles['recipe__content']}></div>
                    <LexicalRenderer content={recipe?.content || ''} className={styles['share-content-renderer']} />

                    <div className={styles['recipe__btn-box']}>
                        <div className={styles['recipe__like-btn-group']}>
                            <button
                                className={`${voteCounts.prevType === 'like' ? styles['recipe__like-btn--active'] : styles['recipe__like-btn']}`}
                                onClick={() => handleLike('like')}
                                aria-label={`좋아요 ${voteCounts.likeCount}개 ${voteCounts.prevType === 'like' ? '(선택됨)' : ''}`}
                                aria-pressed={voteCounts.prevType === 'like'}
                            >
                                <img src={voteCounts.prevType === 'like' ? likeActiveImg : likeImg} alt='' />
                                <span>{voteCounts.likeCount}</span>
                            </button>
                            <button
                                className={`${voteCounts.prevType === 'dislike' ? styles['recipe__dislike-btn--active'] : styles['recipe__dislike-btn']}`}
                                onClick={() => handleLike('dislike')}
                                aria-label={`싫어요 ${voteCounts.dislikeCount}개 ${voteCounts.prevType === 'dislike' ? '(선택됨)' : ''}`}
                                aria-pressed={voteCounts.prevType === 'dislike'}
                            >
                                <img src={voteCounts.prevType === 'dislike' ? dislikeActiveImg : dislikeImg} alt='' />
                                <span>{voteCounts.dislikeCount}</span>
                            </button>
                        </div>

                        <div className={styles['recipe__bookmark-box']}>
                            작성일자 :<time>{recipe?.created_at}</time>
                            <button
                                className={`${styles['recipe__bookmark__btn']} ${isBookmarked ? styles['recipe__bookmark__btn--active'] : ''}`}
                                onClick={handleBookmark}
                                aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
                            ></button>
                        </div>
                    </div>
                </section>

                <section className={styles['recipe__comments-box']}>
                    <h2 className='sr-only'>댓글</h2>
                    {id && <PostComments postId={id} />}
                </section>
            </div>
        </>
    );
};

export default RecipeDetail;
