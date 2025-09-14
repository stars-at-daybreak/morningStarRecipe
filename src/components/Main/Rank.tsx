import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { selectPostsLikeTop3 } from '../../services/supabasePosts';
import type { Tables } from '../../types/supabase';
import styles from './Rank.module.css';
import { getUserProfileImage, getPostThumbnails } from '../../services/supabaseFiles';
import NoneProfileImageUrl from '../../assets/none-profile.svg';
import NoneThumbnailImageUrl from '../../assets/none-thumbnail.svg';
import rank_1 from '../../assets/rank_1.svg';
import rank_2 from '../../assets/rank_2.svg';
import rank_3 from '../../assets/rank_3.svg';
import { getUserNickname } from '../../services/supabaseUsers';

interface PostWithProfileThumbnail extends Tables<'posts'> {
    profileImageUrl?: string;
    thumbnailImageUrl?: string;
    userNickname?: string;
}

const rankImages: Record<string, string> = {
    1: rank_1,
    2: rank_2,
    3: rank_3,
};

const MainRank: React.FC = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [posts, setPosts] = useState<PostWithProfileThumbnail[]>([]);

    // 🔄 데이터 패치 - 프로필과 썸네일을 동시에 처리
    const fetchData = useCallback(async () => {
        try {
            const data = await selectPostsLikeTop3();
            if (!data) throw new Error('데이터를 불러올 수 없습니다.');

            // 각 포스트에 대해 프로필과 썸네일을 동시에 가져오기
            const enrichedPosts = await Promise.all(
                data.map(async post => {
                    const [profileResult, thumbnailResult] = await Promise.allSettled([
                        getUserProfileImage(post.user_id),
                        getPostThumbnails(post.id),
                    ]);

                    const profileImageUrl =
                        profileResult.status === 'fulfilled' ? profileResult.value?.filename : undefined;

                    const thumbnailImageUrl =
                        thumbnailResult.status === 'fulfilled' ? thumbnailResult.value?.filename : undefined;

                    const userNickname = await getUserNickname(post.user_id);

                    return {
                        ...post,
                        profileImageUrl,
                        thumbnailImageUrl,
                        userNickname,
                    };
                })
            );
            setPosts(enrichedPosts);
        } catch (err) {
            console.error('Failed to fetch ranking data:', err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const displayPosts = useMemo(() => posts.slice(0, 3), [posts]);

    // 이미지 에러 핸들러
    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>, fallbackSrc: string) => {
        const target = e.target as HTMLImageElement;
        target.src = fallbackSrc;
    }, []);

    return (
        <section className={styles.ranking}>
            <h2 className={styles.ranking__title}>실시간 인기 랭킹</h2>
            <div className={styles.ranking__container}>
                <ol className={styles.ranking__profiles}>
                    {displayPosts.map((post, index) => (
                        <RankingProfile
                            key={post.id}
                            post={post}
                            index={index}
                            apiUrl={apiUrl}
                            onImageError={handleImageError}
                        />
                    ))}
                </ol>
                <ol className={styles.ranking__posts}>
                    {displayPosts.map((post, index) => (
                        <RankingItem
                            key={post.id}
                            post={post}
                            index={index}
                            apiUrl={apiUrl}
                            onImageError={handleImageError}
                        />
                    ))}
                </ol>
            </div>
        </section>
    );
};

interface RankingItemProps {
    post: PostWithProfileThumbnail;
    index: number;
    apiUrl: string;
    onImageError: (e: React.SyntheticEvent<HTMLImageElement>, fallbackSrc: string) => void;
}

const RankingProfile: React.FC<RankingItemProps> = React.memo(({ post, index, apiUrl, onImageError }) => {
    const getRankModifier = useCallback((i: number) => {
        switch (i) {
            case 0:
                return 'first';
            case 1:
                return 'second';
            case 2:
                return 'third';
            default:
                return 'other';
        }
    }, []);

    const profileImageUrl = useMemo(
        () => (post.profileImageUrl ? `${apiUrl}/${post.profileImageUrl}` : null),
        [apiUrl, post.profileImageUrl]
    );

    const rankModifier = getRankModifier(index);

    return (
        <li className={`${styles.profile} ${styles[`profile__delay--${index}`]}`}>
            {/* 순위 뱃지 */}
            <div className={`${styles.profile__badge} ${styles[`profile__badge--${rankModifier}`]}  `}>
                <span aria-label={`${index + 1}위`} className={styles.profile__rank}>
                    <img
                        src={rankImages[(index + 1).toString()]}
                        alt={`${index + 1}위`}
                        className={styles.profile__rankImg}
                    />
                </span>
            </div>

            {/* 프로필 이미지 */}
            <div className={styles.profile__imagewrap}>
                <img
                    src={profileImageUrl || NoneProfileImageUrl}
                    alt={`${post.userNickname || '익명'} 프로필 이미지`}
                    className={styles.profile__image}
                    crossOrigin='anonymous'
                    loading='lazy'
                    onError={e => onImageError(e, NoneProfileImageUrl)}
                />
            </div>
            <div className={styles.profile__name}>{post.userNickname || '익명'}</div>
        </li>
    );
});

RankingProfile.displayName = 'RankingProfile';

const RankingItem: React.FC<RankingItemProps> = React.memo(({ post, index, apiUrl, onImageError }) => {
    const getRankModifier = useCallback((i: number) => {
        switch (i) {
            case 0:
                return 'first';
            case 1:
                return 'second';
            case 2:
                return 'third';
            default:
                return 'other';
        }
    }, []);

    const getRankSuffix = useCallback((i: number) => {
        const rank = i + 1;
        if (rank === 1) return 'st';
        if (rank === 2) return 'nd';
        if (rank === 3) return 'rd';
        return 'th';
    }, []);

    // URL 메모화
    const thumbnailUrl = useMemo(
        () => (post.thumbnailImageUrl ? `${apiUrl}/${post.thumbnailImageUrl}` : null),
        [apiUrl, post.thumbnailImageUrl]
    );

    const profileImageUrl = useMemo(
        () => (post.profileImageUrl ? `${apiUrl}/${post.profileImageUrl}` : null),
        [apiUrl, post.profileImageUrl]
    );

    const rankModifier = getRankModifier(index);

    return (
        <li className={`${styles.post} ${styles.fadeSlideIn} ${styles[`post--delay-${index}`]}`}>
            {/* 순위 뱃지 */}
            <div className={`${styles.post__badge} ${styles[`post__badge--${rankModifier}`]}`}>
                <span aria-label={`${index + 1}위`} className={styles.post__rank}>
                    {index + 1}
                    {getRankSuffix(index + 1)}
                </span>
            </div>

            {/* 프로필 섹션 */}
            <div className={styles.post__profilesection}>
                <img
                    src={profileImageUrl || NoneProfileImageUrl}
                    alt={`${post.userNickname || '익명'} 프로필 이미지`}
                    className={styles.post__profile}
                    crossOrigin='anonymous'
                    loading='lazy'
                    onError={e => onImageError(e, NoneProfileImageUrl)}
                />
            </div>

            {/* 포스트 제목 */}
            <h3 className={styles.post__title}>{post.title}</h3>

            {/* 포스트 메타 정보 */}
            <div className={styles.post__meta}>
                <img
                    src={thumbnailUrl || NoneThumbnailImageUrl}
                    alt={`${post.title} 썸네일`}
                    className={styles.post__thumbnail}
                    crossOrigin='anonymous'
                    loading='lazy'
                    onError={e => onImageError(e, NoneThumbnailImageUrl)}
                />
            </div>
        </li>
    );
});

RankingItem.displayName = 'RankingItem';

export default MainRank;
