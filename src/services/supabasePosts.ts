import supabase from './supabaseClient.ts';
import type { TablesInsert, TablesUpdate } from '../types/supabase.ts';
import type { PostWithUserNickname } from '../types/posts.type.ts';

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

export const fetchPostWithUserNickname = async (id: string): Promise<PostWithUserNickname | null> => {
    try {
        const { data, error } = await supabase.rpc('get_post_with_user_nickname', {
            post_id_param: id,
        });

        if (error) throw error;
        return data?.[0] || null;
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
