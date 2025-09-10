import supabase from './supabaseClient.ts';
import type { TablesInsert, TablesUpdate } from '../types/supabase.ts';
import type { RecipePost } from '../types/myPosts.types.ts';

export const createPost = async (post: TablesInsert<'posts'>) => {
    try {
        const { error } = await supabase.from('posts').insert(post);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('게시글 등록 중 에러 발생:', error);
        return false;
    }
};

export const updatePost = async (post: TablesUpdate<'posts'>) => {
    try {
        const { error } = await supabase.from('posts').update(post).eq('id', post.id).eq('user_id', post.user_id);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('게시글 수정 중 에러 발생:', error);
        return false;
    }
};

export const fetchPost = async (id: string): Promise<RecipePost | null> => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .eq('is_post_active', true)
            .single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('게시글 상세 조회 중 에러 발생:', error);
        return null;
    }
};

export const deletePost = async (id: string, userId: string) => {
    try {
        const { error } = await supabase
            .from('posts')
            .update({ is_post_active: false })
            .eq('id', id)
            .eq('user_id', userId);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('게시글 삭제 중 에러 발생:', error);
        return false;
    }
};
