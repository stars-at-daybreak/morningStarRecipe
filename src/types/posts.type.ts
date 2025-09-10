import type { Tables } from './supabase.ts';

export type PostWithUserNickname = Tables<'posts'> & {
    user_nickname: string;
};