import supabase from './supabaseClient.ts';
import type { Tables, TablesInsert, TablesUpdate } from '../types/supabase.ts';

export const fetchComments = async (id: string): Promise<Tables<'comments'>[] | null> => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', id)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('댓글 조회 중 오류 발생:', error);
        return null;
    }
};

export const createComment = async (comment: TablesInsert<'comments'>): Promise<boolean> => {
    try {
        const { error } = await supabase.from('comments').insert(comment);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('댓글 등록 중 오류 발생:', error);
        return false;
    }
};

export const updateComment = async (comment: TablesUpdate<'comments'>): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('comments')
            .update(comment)
            .eq('id', comment.id)
            .eq('user_id', comment.user_id);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('댓글 수정 중 오류 발생:', error);
        return false;
    }
};

export const deleteComment = async (id: string, userId: string) => {
    try {
        const { error } = await supabase.from('comments').delete().eq('id', id).eq('user_id', userId);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('댓글 삭제 중 오류 발생:', error);
        return false;
    }
};
