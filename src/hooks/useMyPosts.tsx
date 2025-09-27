import { useState, useCallback } from 'react';
import type { MyPost, UseMyPostsReturn } from '../types/myPosts.types';
import { selectMyPostsByUserId } from '../services/supabasePosts';
export const useMyPosts = (): UseMyPostsReturn => {
    const [myPosts, setMyPosts] = useState<MyPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // 내가 작성한 게시글 목록 가져오기
    const fetchMyPosts = useCallback(async (userId: string) => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await selectMyPostsByUserId(userId);
            if (error) throw error;
            const postsData = data as MyPost[];
            setMyPosts(postsData);
        } catch (error) {
            console.error('내 게시글 조회 실패:', error);
            setError(error instanceof Error ? error.message : '내 게시글을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);
    // 내 게시글 목록 초기화 (로그아웃 시 사용)
    const clearMyPosts = useCallback(() => {
        setMyPosts([]);
        setLoading(false);
        setError(null);
    }, []);
    return {
        myPosts,
        loading,
        error,
        fetchMyPosts,
        clearMyPosts,
    };
};

// 사용법
// import React, { useEffect } from 'react';
// import useUserStore from './stores/useUserStore.ts';
// import { useMyPosts } from '../../hooks/useMyPosts';
//import type { MyPost } from '../../types/myPosts.types';
// const MyPostsPage = () => {
//     const { user } = useUserStore();
// const { myPosts, loading, error, fetchMyPosts, clearMyPosts } = useMyPosts();
// useEffect(() => {
//     if (user?.id) {
//         fetchMyPosts(user.id);
//     }
// }, [user?.id, fetchMyPosts]);

//     useEffect(() => {
//         if (user?.id) {
//             fetchMyPosts(user.id);
//         } else {
//             clearMyPosts(); // 로그아웃 시 초기화
//         }
//     }, [user?.id]);

//     if (loading) return <div>내 게시글을 불러오는 중...</div>;
//     if (error) return <div>오류: {error}</div>;

//     return (
//         <div className="my-posts-page">
//             <h1>내가 작성한 게시글</h1>
//             {myPosts.length === 0 ? (
//                 <p>작성한 게시글이 없습니다.</p>
//             ) : (
//                 <div className="posts-list">
//                     {myPosts.map(post => (
//                         <div key={post.id} className="post-item">
//                             <h3>{post.title}</h3>
//                             <p>{post.content}</p>
//                             <div className="post-meta">
//                                 <span>조리시간: {post.cooking_time}분</span>
//                                 <span>인분: {post.servings}인분</span>
//                                 <span>난이도: {post.difficulty}</span>
//
//                             </div>
//                             <small>
//                                 작성일: {new Date(post.created_at ? post.created_at : '').toLocaleDateString()}
//                             </small>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MyPostsPage;
