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

//레시피
export type RecipePost = Omit<MyPost, 'share_status' | 'pickup_location'> & {
    post_type: 'recipe';
    difficulty: NonNullable<MyPost['difficulty']>;
    cooking_time: number;
    ingredients: string;
    servings: number;

    share_status?: never;
    pickup_location?: never;
};
