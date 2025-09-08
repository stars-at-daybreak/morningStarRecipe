import { useBookmarkStore } from '../stores/useBookmarkStore';
import type { UseBookmarksReturn } from '../types/bookmark.types';

export const useBookmarks = (): UseBookmarksReturn => {
    const bookmarks = useBookmarkStore(state => state.bookmarks);
    const loading = useBookmarkStore(state => state.loading);
    const error = useBookmarkStore(state => state.error);
    const fetchBookmarks = useBookmarkStore(state => state.fetchBookmarks);
    const clearBookmarks = useBookmarkStore(state => state.clearBookmarks);

    return {
        bookmarks,
        loading,
        error,
        fetchBookmarks,
        clearBookmarks,
    };
};

// 사용법
// import React, { useEffect } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { useBookmarks } from '../../hooks/useBookmark';
// const BookmarkPage = () => {
//     const { user } = useAuth();
//     const { bookmarks, loading, error, fetchBookmarks } = useBookmarks();

//     useEffect(() => {
//         if (user?.id) {
//             fetchBookmarks(user.id);
//         }
//     }, [user?.id, fetchBookmarks]); // fetchBookmarks 의존성 추가

//     if (loading) return <div>북마크를 불러오는 중...</div>;
//     if (error) return <div>오류: {error}</div>;

//     return (
//         <div className="bookmark-page">
//             <h1>내 북마크</h1>
//             {bookmarks.length === 0 ? (
//                 <p>북마크한 게시물이 없습니다.</p>
//             ) : (
//                 <div className="bookmark-list">
//                     {bookmarks.map(bookmark => (
//                         <div key={bookmark.id} className="bookmark-item">
//                             <h3>{bookmark.posts.title}</h3>
//                             <p>{bookmark.posts.content}</p>
//                             <small>카테고리: {bookmark.posts.categories.name}</small>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };
