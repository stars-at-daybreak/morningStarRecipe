// types/bookmark.types.ts
import type { Tables } from './supabase';

// ==================== 기본 테이블 타입 ====================
export type Post = Tables<'posts'>;
export type PostBookmark = Tables<'post_bookmarks'>;

// ==================== 확장된 데이터 타입 ====================
export interface BookmarkedPost extends PostBookmark {
    posts: Post & {
        categories: {
            name: string;
        };
    };
}

// ==================== 훅 반환 타입 ====================
export interface UseBookmarksReturn {
    bookmarks: BookmarkedPost[];
    loading: boolean;
    error: string | null;
    fetchBookmarks: (userId: string) => Promise<void>;
    clearBookmarks: () => void;
}

// ==================== 스토어 상태 타입 ====================
export interface BookmarkState extends UseBookmarksReturn {}
