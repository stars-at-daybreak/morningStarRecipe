// supabasePostBookmark.ts
import supabase from './supabaseClient.ts';

export const selectBookmarksByUserIdPostId = async (postId: string, userId: string) => {
    try {
        const { data, error } = await supabase
            .from('post_bookmarks')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw error;

        // data가 존재하면 true, 없으면 false
        return data !== null;
    } catch (error) {
        console.error('찜하기 여부 조회 중 에러 발생:', error);
        return false; // 에러 시 false 반환 (null 대신)
    }
};

export const insertBookmarkRecord = async (postId: string, userId: string) => {
    try {
        const { error } = await supabase.from('post_bookmarks').insert([{ post_id: postId, user_id: userId }]);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('북마크 추가 중 에러 발생:', error);
        return false;
    }
};

export const deleteBookmarkRecord = async (postId: string, userId: string) => {
    try {
        const { error } = await supabase.from('post_bookmarks').delete().eq('post_id', postId).eq('user_id', userId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('북마크 삭제 중 에러 발생:', error);
        return false;
    }
};
