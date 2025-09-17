import type { Tables } from './supabase.ts';

export type CommentWithUserNickname = Tables<'comments'> & {
    user_nickname: string;
    user_level_title: string;
    current_level: 1 | 2 | 3 | 4;
    user_profile_img: string | null;
};
