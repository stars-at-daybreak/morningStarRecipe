import supabase from './supabaseClient.ts';
import type { UserLevel } from '../types/userLevel.type.ts';

export const fetchUserLevel = async (userId: string): Promise<UserLevel | null> => {
    try {
        const { data, error } = await supabase.rpc('get_user_level', {
            p_user_id: userId,
        });
        if (error) throw error;
        return data?.[0] || { user_id: userId, current_level: 1, total_posts_created: 0 };
    } catch (error) {
        console.error('사용자 레벨 조회 중 에러 발생:', error);
        return null;
    }
};
