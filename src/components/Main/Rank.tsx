import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { selectPostsLikeTop3 } from '../../services/supabasePosts';
import type { Tables } from '../../types/supabase';
import styles from './Rank.module.css';
import { getUserProfileImage, getPostThumbnails } from '../../services/supabaseFiles';
import NoneProfileImageUrl from '../../assets/none-profile.svg';
import NoneThumbnailImageUrl from '../../assets/none-thumbnail.svg';

const MAX_DISPLAY_POSTS = 10;

interface PostWithProfileThumbnail extends Tables<'posts'> {
    profileImageUrl?: string;
    thumbnailImageUrl?: string;
}

const MainRank: React.FC = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [posts, setPosts] = useState<PostWithProfileThumbnail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🔄 데이터 패치 - 프로필과 썸네일을 동시에 처리
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
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
                    return {
                        ...post,
                        profileImageUrl,
                        thumbnailImageUrl,
                    };
                })
            );
            setPosts(enrichedPosts);
        } catch (err) {
            console.error('Failed to fetch ranking data:', err);
            setError('데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 메모화된 유틸리티 함수들
    const formatLikeCount = useCallback((count: number | null): string => {
        if (!count || count === 0) return '0';
        return count.toLocaleString('ko-KR');
    }, []);

    const formatDate = useCallback((dateString: string | null): string => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return '-';
        }
    }, []);

    const displayPosts = useMemo(() => posts.slice(0, MAX_DISPLAY_POSTS), [posts]);

    // 이미지 에러 핸들러
    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>, fallbackSrc: string) => {
        const target = e.target as HTMLImageElement;
        target.src = fallbackSrc;
    }, []);

    // 렌더링 분기 처리
    if (loading) {
        return (
            <div className={styles.loadingContainer} role='status' aria-live='polite'>
                <div className={styles.loadingText}>로딩 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer} role='alert'>
                <p className={styles.errorMessage}>{error}</p>
                <button onClick={fetchData} className={styles.retryButton} type='button'>
                    다시 시도
                </button>
            </div>
        );
    }

    if (displayPosts.length === 0) {
        return (
            <section className={styles.container}>
                <h2 className={styles.title}>실시간 인기 랭킹</h2>
                <div className={styles.emptyState} role='status'>
                    게시물이 없습니다.
                </div>
            </section>
        );
    }

    return (
        <section className={styles.container}>
            <h2 className={styles.title}>실시간 인기 랭킹</h2>
            <ol className={styles.rankingList}>
                {displayPosts.map((post, index) => (
                    <RankingItem
                        key={post.id}
                        post={post}
                        index={index}
                        apiUrl={apiUrl}
                        formatLikeCount={formatLikeCount}
                        formatDate={formatDate}
                        onImageError={handleImageError}
                    />
                ))}
            </ol>
        </section>
    );
};

interface RankingItemProps {
    post: PostWithProfileThumbnail;
    index: number;
    apiUrl: string;
    formatLikeCount: (count: number | null) => string;
    formatDate: (dateString: string | null) => string;
    onImageError: (e: React.SyntheticEvent<HTMLImageElement>, fallbackSrc: string) => void;
}

const RankingItem: React.FC<RankingItemProps> = React.memo(({ post, index, apiUrl, onImageError }) => {
    const getRankBadgeClass = useCallback((i: number) => {
        switch (i) {
            case 0:
                return styles.rank1;
            case 1:
                return styles.rank2;
            case 2:
                return styles.rank3;
            default:
                return styles.rankOther;
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

    return (
        <li className={`${styles.rankingItem} ${styles.fadeSlideIn} ${styles[`delay${index}`]}`}>
            {/* 순위 뱃지 */}
            <div className={`${styles.rankBadge} ${getRankBadgeClass(index)}`}>
                <span aria-label={`${index + 1}위`} className={`${styles.rankText} `}>
                    {index + 1}
                    {getRankSuffix(index)}
                </span>
            </div>

            {/* 프로필 이미지 */}
            <div className={styles.profileSection}>
                <img
                    src={profileImageUrl || NoneProfileImageUrl}
                    alt='프로필 이미지'
                    className={styles.profileImage}
                    crossOrigin='anonymous'
                    loading='lazy'
                    onError={e => onImageError(e, NoneProfileImageUrl)}
                />
            </div>

            <h3 className={styles.postTitle}>{post.title}</h3>
            <div className={styles.postMeta}>
                {/* 썸네일 이미지 */}
                <img
                    src={thumbnailUrl || NoneThumbnailImageUrl}
                    alt={`${post.title} 썸네일`}
                    className={styles.postThumbnail}
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
