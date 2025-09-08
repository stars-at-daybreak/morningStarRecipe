import { useMyPostsStore } from '../stores/useMyPostsStore';
import type { UseMyPostsReturn } from '../types/myPosts.types';

export const useMyPosts = (): UseMyPostsReturn => {
    const myPosts = useMyPostsStore(state => state.myPosts);
    const loading = useMyPostsStore(state => state.loading);
    const error = useMyPostsStore(state => state.error);
    const fetchMyPosts = useMyPostsStore(state => state.fetchMyPosts);
    const clearMyPosts = useMyPostsStore(state => state.clearMyPosts);

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
// import { useAuth } from '../../hooks/useAuth';
// import { useMyPosts } from '../../hooks/useMyPosts';

// const MyPostsPage = () => {
//     const { user } = useAuth();
//     const { myPosts, loading, error, fetchMyPosts, clearMyPosts } = useMyPosts();

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
//                                 <span>조회수: {post.view_count}</span>
//                             </div>
//                             <small>
//                                 작성일: {new Date(post.created_at).toLocaleDateString()}
//                             </small>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MyPostsPage;
