import { useState, useEffect, useRef } from 'react';
import PostItem from '../postItem/PostItem';
import type { Tables } from '../../types/supabase';
import { SyncLoader } from 'react-spinners';
import styles from './InfiniteScroll.module.css';
import EmptyState from '../EmptyState/EmptyState';

interface InfinitePostListProps {
    type: 'recipe' | 'share';
    fetchFunction: (page: number) => Promise<Tables<'posts'>[]>;
    onPostClick?: (postId: string) => void;
}

const InfinitePostList = ({ type, fetchFunction, onPostClick }: InfinitePostListProps) => {
    const [posts, setPosts] = useState<Tables<'posts'>[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const pageRef = useRef<number>(0);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const fetchFunctionRef = useRef(fetchFunction);

    // fetchFunction이 변경될 때마다 ref 업데이트
    useEffect(() => {
        fetchFunctionRef.current = fetchFunction;
    }, [fetchFunction]);

    // 데이터 로드 함수
    const loadMoreData = async (isInitial: boolean = false) => {
        if (loading) return;

        setLoading(true);
        const currentPage = isInitial ? 0 : pageRef.current;

        try {
            // 최소 1초는 로딩 표시
            const [newPosts] = await Promise.all([
                fetchFunctionRef.current(currentPage),
                new Promise(resolve => setTimeout(resolve, 1000)), // 1초 딜레이
            ]);

            setPosts(currentPosts => {
                if (isInitial) {
                    pageRef.current = 1;
                    return newPosts;
                }
                pageRef.current = currentPage + 1;
                return [...currentPosts, ...newPosts];
            });

            if (newPosts.length === 0) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('데이터 로드 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    // Intersection Observer 설정
    const setObserver = (node: HTMLDivElement | null) => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        if (node && hasMore && !loading) {
            observerRef.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    loadMoreData(false);
                }
            });
            observerRef.current.observe(node);
        }
    };

    // 초기 데이터 로드
    useEffect(() => {
        pageRef.current = 0;
        setPosts([]);
        setHasMore(true);
        loadMoreData(true);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchFunction]);

    const [spinnerSize, setSpinnerSize] = useState(8);

    // 스피너 반응형으로 크가 적용
    useEffect(() => {
        const updateSpinnerSize = () => {
            if (window.innerWidth >= 768) {
                setSpinnerSize(12); // 태블릿
            } else {
                setSpinnerSize(8); // 모바일
            }
        };

        updateSpinnerSize();
        window.addEventListener('resize', updateSpinnerSize);
        return () => window.removeEventListener('resize', updateSpinnerSize);
    }, []);

    return (
        <div className={styles['infinite-post-list']}>
            <div className={styles['infinite-post-list__container']}>
                {posts.map((post, index) => (
                    <div
                        key={post.id}
                        ref={index === posts.length - 1 ? setObserver : null}
                        className={styles['infinite-post-list__item']}
                    >
                        <PostItem post={post} type={type} onClick={onPostClick} />
                    </div>
                ))}
            </div>

            {loading && (
                <div className={styles['infinite-post-list__loading']}>
                    <SyncLoader color='var(--color-green)' size={spinnerSize} margin={2} />
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <div className={styles['infinite-post-list__end']}>모든 게시물을 불러왔습니다.</div>
            )}

            {/* 로딩 중이 아닐 때 게시물이 없으면 EmptyState를 렌더링 */}
            {!loading && posts.length === 0 && <EmptyState title='아직 아무것도 없어요' />}
        </div>
    );
};

export default InfinitePostList;

/* 사용법 */
/* 
import { useNavigate } from 'react-router-dom';
import { getRecipesWithPagination } from '../../services/supabasePosts';
import InfinitePostList from '../../components/InfinitePostList';
  
  const navigate = useNavigate();

  const handlePostClick = (postId: string) => {
        navigate(`/recipes/${postId}`);
    };


  return (
      <div>
          <InfinitePostList 
              type="recipe"
              fetchFunction={getRecipesWithPagination}
              onPostClick={handlePostClick}
          />
      </div>
  );

*/
