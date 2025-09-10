import { useState, useCallback } from 'react';
import { selectBookmarksByUserId } from '../services/supabasePosts';
import type { BookmarkedPost, UseBookmarksReturn } from '../types/bookmark.types';

export const useBookmarks = (): UseBookmarksReturn => {
    const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 찜한 게시글 목록 가져오기
    const fetchBookmarks = useCallback(async (userId: string) => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await selectBookmarksByUserId(userId);

            if (!data) {
                throw new Error('찜 목록을 불러올 수 없습니다.');
            }

            setBookmarks(data);
        } catch (error) {
            console.error('찜 목록 조회 실패:', error);
            setError(error instanceof Error ? error.message : '찜 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    // 찜 목록 초기화 (로그아웃 시 사용)
    const clearBookmarks = useCallback(() => {
        setBookmarks([]);
        setLoading(false);
        setError(null);
    }, []);

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
// import useUserStore from './stores/useUserStore.ts';
// import { useBookmarks } from '../../hooks/useBookmark';
// const BookmarkPage = () => {
//     const { user } = useUserStore();
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
