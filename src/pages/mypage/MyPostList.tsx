import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageSetup } from '../../hooks/usePageSetup.tsx';
import useUserStore from '../../stores/useUserStore.ts';
import { selectMyPostsByUserId } from '../../services/supabasePosts.ts';
import { getUserProfileImage } from '../../services/supabaseFiles.ts';
import type { Tables } from '../../types/supabase.ts';
import InfinitePostList from '../../components/infiniteScroll/InfiniteScroll.tsx';
import styles from './myPostList.module.css';

type PostType = 'recipe' | 'share';

function MyPostList() {
    usePageSetup({
        title: '내가 올린 게시물 리스트',
        pageName: 'my-postList',
        showBackButton: true,
    });

    const navigate = useNavigate();
    const { user } = useUserStore();

    const [activeTab, setActiveTab] = useState<PostType>('recipe');
    const [allMyPosts, setAllMyPosts] = useState<Tables<'posts'>[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isEmpty, setIsEmpty] = useState(false);
    const [userProfileImage, setUserProfileImage] = useState<Tables<'files'> | null>(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false); // 데이터 로드 상태 추가

    // 내 모든 게시물과 프로필 이미지 가져오기
    useEffect(() => {
        if (user?.id) {
            const fetchData = async () => {
                // 게시물 가져오기
                const posts = await selectMyPostsByUserId(user.id);
                if (posts) {
                    setAllMyPosts(posts);
                    setTotalCount(posts.length);
                } else {
                    setAllMyPosts([]);
                    setTotalCount(0);
                }

                // 프로필 이미지 가져오기
                const profileImage = await getUserProfileImage(user.id);
                setUserProfileImage(profileImage);

                setIsDataLoaded(true); // 데이터 로드 완료
            };
            fetchData();
        }
    }, [user?.id]);

    // 탭 변경 시 isEmpty 상태 업데이트 (데이터 로드 완료 후에만)
    useEffect(() => {
        if (isDataLoaded) {
            const filteredPosts = allMyPosts.filter(post => post.post_type === activeTab);
            setIsEmpty(filteredPosts.length === 0);
        }
    }, [activeTab, allMyPosts, isDataLoaded]);

    const handlePostClick = (postId: string) => {
        if (activeTab === 'recipe') {
            navigate(`/recipes/${postId}`);
        } else {
            navigate(`/share/${postId}`);
        }
    };

    // 현재 탭에 맞는 게시물을 페이지네이션으로 가져오는 함수
    const fetchMyPosts = async (page: number): Promise<Tables<'posts'>[]> => {
        if (!user?.id) return [];

        try {
            // 현재 탭에 맞는 게시물만 필터링
            const filteredPosts = allMyPosts.filter(post => post.post_type === activeTab);

            // 페이지네이션 적용
            const start = page * 5;
            const end = start + 5;
            const paginatedPosts = filteredPosts.slice(start, end);

            return paginatedPosts;
        } catch (error) {
            console.error('내 게시물을 불러오는 중 오류가 발생했습니다.', error);
            return [];
        }
    };

    return (
        <>
            <title>내 게시물 - 모두의 부엌</title>
            <meta name='description' content='내가 작성한 레시피와 나눔 게시글을 확인하고 관리하세요.' />
            <meta name='robots' content='noindex, nofollow' />
            <link rel='canonical' href='https://morningstarrecipe.netlify.app/mypage/my-postList' />
            <section className={styles['my-post-list']}>
                <div className={styles['my-post-list__container']}>
                    {/* 프로필 영역 */}
                    <div className={styles['my-post-list__profile']}>
                        <div className={styles['my-post-list__profile-image']}>
                            {userProfileImage ? (
                                <img
                                    src={`${import.meta.env.VITE_API_BASE_URL}/${userProfileImage.filename}`}
                                    alt='프로필 이미지'
                                    crossOrigin='anonymous'
                                />
                            ) : (
                                <div className={styles['my-post-list__profile-default']} />
                            )}
                        </div>
                        <div className={styles['my-post-list__profile-info']}>
                            <h2 className={styles['my-post-list__profile-title']}>총 게시물 수</h2>
                            <span className={styles['my-post-list__profile-count']}>{totalCount}개</span>
                        </div>
                    </div>

                    {/* 탭 영역 */}
                    <div className={styles['my-post-list__tabs']}>
                        <div className={styles['my-post-list__tabs-wrap']}>
                            <button
                                className={`${styles['my-post-list__tab']} ${activeTab === 'recipe' ? styles['my-post-list__tab--active'] : ''}`}
                                onClick={() => setActiveTab('recipe')}
                            >
                                모두의 레시피
                            </button>
                            <button
                                className={`${styles['my-post-list__tab']} ${activeTab === 'share' ? styles['my-post-list__tab--active'] : ''}`}
                                onClick={() => setActiveTab('share')}
                            >
                                모두의 나눔
                            </button>
                        </div>
                    </div>

                    {/* 게시물 리스트 */}
                    <div
                        className={`${styles['my-post-list__posts']} ${isEmpty ? styles['my-post-list__posts--empty'] : ''}`}
                    >
                        {isDataLoaded && (
                            <InfinitePostList
                                type={activeTab}
                                fetchFunction={fetchMyPosts}
                                onPostClick={handlePostClick}
                                emptyTitle={
                                    activeTab === 'recipe' ? '맛있는 레시피를 기다려요' : '따뜻한 나눔을 기다려요'
                                }
                                key={activeTab} // 탭 변경 시 컴포넌트 리렌더링
                            />
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default MyPostList;
