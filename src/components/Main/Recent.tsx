import React, { useState, useEffect } from 'react';
import { selectRecentPostsTOP6 } from '../../services/supabasePosts';
import type { Tables } from '../../types/supabase';
import styles from './Recent.module.css';
import { Link } from 'react-router-dom';
import { getPostThumbnails } from '../../services/supabaseFiles';
import NoneThumnailImageUrl from '../../assets/picture_icon.svg';
// 확장된 타입 정의
type EnrichedPost = Tables<'posts'> & {
    thumbnailImageUrl?: string;
};

const Recent: React.FC = () => {
    const [posts, setPosts] = useState<EnrichedPost[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setError(null);

            const data = await selectRecentPostsTOP6();
            // null 체크 추가
            if (!data) {
                setPosts([]);
                return;
            }
            const enrichedPosts = await Promise.all(
                data.map(async (post): Promise<EnrichedPost> => {
                    try {
                        // 단일 Promise이므로 allSettled 대신 try-catch 사용
                        const thumbnailData = await getPostThumbnails(post.id);
                        return {
                            ...post,
                            thumbnailImageUrl: thumbnailData?.filename,
                        };
                    } catch (thumbnailError) {
                        console.warn(`Failed to get thumbnail for post ${post.id}:`, thumbnailError);
                        return {
                            ...post,
                            thumbnailImageUrl: undefined,
                        };
                    }
                })
            );

            setPosts(enrichedPosts);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            setError('데이터를 불러오는데 실패했습니다.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl: string) => {
        const target = e.target as HTMLImageElement;
        target.src = fallbackUrl;
        target.classList.add(styles.fallbackImage);
    };

    if (error) {
        return (
            <div className={styles.Recent}>
                <div className='text-center p-8 text-red-500'>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.Recent}>
            <h2 className={styles.RecentTitle}>모두의 레시피</h2>

            {posts.length > 0 ? (
                <div className={styles.RecentList}>
                    {posts.map((post, index) => (
                        <Link to={`/recipes/${post.id}`} key={post.id} className={styles.RecentItem}>
                            <img
                                src={`${import.meta.env.VITE_API_BASE_URL}/${post.thumbnailImageUrl}`}
                                alt={post.title || '레시피 이미지'}
                                className={styles.thumbnail}
                                onError={e => handleImageError(e, NoneThumnailImageUrl)}
                            />
                        </Link>
                    ))}
                </div>
            ) : (
                <div className='text-center p-8 text-gray-500'>게시물이 없습니다.</div>
            )}

            <Link to='/recipes' className={styles.viewMoreButton}>
                더보기
            </Link>
        </div>
    );
};

export default Recent;
