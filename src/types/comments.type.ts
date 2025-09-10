import type { Tables } from './supabase.ts';

export type CommentWithUserNickname = Tables<'comments'> & {
    user_nickname: string;
};