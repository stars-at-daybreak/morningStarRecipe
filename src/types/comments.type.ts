import type { Tables } from './supabase.ts';

export type CommentWithUserNickname = Tables<'comments'> & {
    user_nickname: string;
    user_level_title: string;
};