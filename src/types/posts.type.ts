import type { Tables } from './supabase.ts';

export type PostWithUserNickname = Tables<'posts'> & {
    user_nickname: string;
    user_level_title: string;
    current_level: 1 | 2 | 3 | 4;
};
