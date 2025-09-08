// types/myPosts.types.ts
import type { Tables } from './supabase';

// 기본 테이블 타입
export type MyPost = Tables<'posts'>;

// 함수 시그니처 타입
export type FetchMyPostsFunction = (userId: string) => Promise<void>;
export type ClearMyPostsFunction = () => void;

// 훅 반환 타입
export interface UseMyPostsReturn {
    myPosts: MyPost[];
    loading: boolean;
    error: string | null;
    fetchMyPosts: FetchMyPostsFunction;
    clearMyPosts: ClearMyPostsFunction;
}

// 스토어 상태 타입
export interface MyPostsState extends UseMyPostsReturn {}
