import supabase from './supabaseClient.ts';
import type { TablesInsert, TablesUpdate } from '../types/supabase.ts';
import type { CommentWithUserNickname } from '../types/comments.type.ts';

export const fetchCommentsWithUserNickname = async (id: string): Promise<CommentWithUserNickname[] | null> => {
    try {
        const { data, error } = await supabase.rpc('get_comments_with_user_nickname', {
            post_id_param: id,
        });
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
        const { error } = await supabase
            .from('comments')
            .update({ is_comment_active: false })
            .eq('id', id)
            .eq('user_id', userId);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('댓글 삭제 중 오류 발생:', error);
        return false;
    }
};
