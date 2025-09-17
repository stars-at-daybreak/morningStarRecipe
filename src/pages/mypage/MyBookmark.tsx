import { useNavigate } from 'react-router-dom';
import { usePageSetup } from '../../hooks/usePageSetup.tsx';
import { useState } from 'react';
import useUserStore from '../../stores/useUserStore.ts';
import { selectBookmarksByUserId } from '../../services/supabasePosts.ts';
import type { Tables } from '../../types/supabase.ts';
import InfinitePostList from '../../components/infiniteScroll/InfiniteScroll.tsx';
import styles from './myBookmark.module.css';
function MyBookmark() {
    usePageSetup({
        title: '내가 찜한 리스트',
        pageName: 'my-bookmark',
        showBackButton: true,
    });

    const navigate = useNavigate();
    const { user } = useUserStore();
    const [isEmpty, setIsEmpty] = useState(false);

    const handlePostClick = (postId: string) => {
        navigate(`/recipes/${postId}`);
    };

    // 북마크된 포스트를 페이지네이션으로 가져오는 함수
    const fetchBookmarkedPosts = async (page: number): Promise<Tables<'posts'>[]> => {
        if (!user?.id) return [];

        try {
            // 페이지네이션 옵션과 함께 호출
            const data = await selectBookmarksByUserId(user.id, {
                page,
                pageSize: 5,
            });

            if (data) {
                const recipeBookmarks = data.filter(bookmark => bookmark.posts?.post_type === 'recipe');
                const posts = recipeBookmarks.map(bookmark => bookmark.posts!);

                // 첫 페이지이고 게시물이 없으면 isEmpty를 true로 설정
                if (page === 0 && posts.length === 0) {
                    setIsEmpty(true);
                } else if (posts.length > 0) {
                    setIsEmpty(false);
                }

                return posts;
            }

            // 첫 페이지이고 데이터가 없으면 isEmpty를 true로 설정
            if (page === 0) {
                setIsEmpty(true);
            }

            return [];
        } catch (error) {
            console.error('찜 목록을 불러오는 중 오류가 발생했습니다.', error);
            return [];
        }
    };

    // 로그인하지 않은 경우 빈 상태 표시
    if (!user?.id) {
        return (
            <section className={`${styles['my-bookmark']} ${styles['my-bookmark--empty']}`}>
                <div>로그인이 필요합니다.</div>
            </section>
        );
    }

    return (
        <section className={styles['my-bookmark']}>
            <div
                className={`${styles['my-bookmark__post-list']} ${isEmpty ? styles['my-bookmark__post-list--empty'] : ''}`}
            >
                <InfinitePostList
                    type='recipe'
                    fetchFunction={fetchBookmarkedPosts}
                    onPostClick={handlePostClick}
                    emptyTitle='아직 찜한게 없어요'
                />
            </div>
        </section>
    );
}

export default MyBookmark;
