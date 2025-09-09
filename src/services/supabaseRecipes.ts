import supabase from './supabaseClient.ts';
import type { TablesInsert } from '../types/supabase.ts';

export const createRecipe = async (post: TablesInsert<'posts'>) => {
    try {
        const { error } = await supabase.from('posts').insert(post);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('레시피 등록 중 에러 발생:', error);
        return false;
    }
};
