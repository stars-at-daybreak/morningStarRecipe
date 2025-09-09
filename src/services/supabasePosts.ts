import supabase from './supabaseClient.ts';
import type { TablesInsert, TablesUpdate } from '../types/supabase.ts';
import type { RecipePost } from '../types/myPosts.types.ts';

export const createRecipe = async (post: TablesInsert<'posts'>) => {
    try {
        const { error } = await supabase.from('posts').insert(post);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('게시글 등록 중 에러 발생:', error);
        return false;
    }
};

export const updateRecipe = async (id: string, post: TablesUpdate<'posts'>, userId: string) => {
    try {
        const { error } = await supabase.from('posts').update(post).eq('id', id).eq('user_id', userId);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('게시글 수정 중 에러 발생:', error);
        return false;
    }
};

export const fetchRecipe = async (id: string): Promise<RecipePost | null> => {
    try {
        const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('게시글 상세 조회 중 에러 발생:', error);
        return null;
    }
};
