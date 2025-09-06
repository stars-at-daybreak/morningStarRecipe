// types/myPosts.types.ts
import type { Tables } from './supabase';

// 기본 타입들
export type Post = Tables<'posts'>;

// 내 게시글 정보 (카테고리 정보 포함)
export type MyPost = Post & {
    categories: {
        id: string;
        name: string;
    };
};

// Zustand 스토어 상태 인터페이스
export interface MyPostsState {
    // 상태
    myPosts: MyPost[];
    loading: boolean;
    error: string | null;

    // 액션
    fetchMyPosts: (userId: string) => Promise<void>;
    clearMyPosts: () => void;
}

// 커스텀 훅 반환 타입
export interface UseMyPostsReturn {
    myPosts: MyPost[];
    loading: boolean;
    error: string | null;
    fetchMyPosts: (userId: string) => Promise<void>;
    clearMyPosts: () => void;
}
