// types/bookmark.types.ts
import type { Tables } from './supabase';

// 기본 타입들
export type Bookmark = Tables<'post_bookmarks'>;
export type Post = Tables<'posts'>;

// 찜한 게시글 정보 (게시글 정보 포함)
export type BookmarkedPost = Bookmark & {
    posts: Post & {
        categories: {
            name: string;
        };
    };
};

// Zustand 스토어 상태 인터페이스
export interface BookmarkState {
    // 상태
    bookmarks: BookmarkedPost[];
    loading: boolean;
    error: string | null;

    // 액션
    fetchBookmarks: (userId: string) => Promise<void>;
    clearBookmarks: () => void;
}

// 커스텀 훅 반환 타입
export interface UseBookmarksReturn {
    bookmarks: BookmarkedPost[];
    loading: boolean;
    error: string | null;
    fetchBookmarks: (userId: string) => Promise<void>;
    clearBookmarks: () => void;
}
