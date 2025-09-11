import supabase from '../services/supabaseClient.ts';
import type { SaveFileParams } from '../types/files.type.ts';

/**
 * 외부 서버에 파일 업로드 후 받은 파일명을 Supabase에 저장
 */
export const saveUploadedFile = async ({ filename, fileType, postId }: SaveFileParams): Promise<string | null> => {
    try {
        const { data, error } = await supabase.rpc('save_uploaded_file', {
            p_filename: filename,
            p_file_type: fileType,
            p_post_id: postId || null,
        });

        if (error) {
            console.error('파일 저장 실패:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('saveUploadedFile 에러:', error);
        return null;
    }
};

/**
 * 프로필 이미지 저장
 */
export const saveProfileImage = async (filename: string): Promise<string | null> => {
    try {
        // 1. 기존 프로필 이미지 삭제
        const { error: deleteError } = await supabase
            .from('files')
            .delete()
            .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
            .eq('file_type', 'profile');

        if (deleteError) {
            console.warn('기존 프로필 이미지 삭제 실패:', deleteError);
        }

        // 2. 새 프로필 이미지 저장
        return await saveUploadedFile({
            filename,
            fileType: 'profile',
        });
    } catch (error) {
        console.error('saveProfileImage 에러:', error);
        return null;
    }
};

/**
 * 썸네일 이미지 저장
 */
export const saveThumbnailImage = async (filename: string, postId: string): Promise<string | null> => {
    try {
        // 1. 기존 썸네일 이미지들 삭제
        const { error: deleteError } = await supabase
            .from('files')
            .delete()
            .eq('post_id', postId)
            .eq('file_type', 'thumbnail');

        if (deleteError) {
            console.warn('기존 썸네일 이미지 삭제 실패:', deleteError);
        }

        // 2. 새 썸네일 이미지 저장
        return await saveUploadedFile({
            filename,
            fileType: 'thumbnail',
            postId,
        });
    } catch (error) {
        console.error('saveThumbnailImage 에러:', error);
        return null;
    }
};

/**
 * 사용자 프로필 이미지 조회
 */
export const getUserProfileImage = async (userId: string) => {
    try {
        const { data, error } = await supabase.rpc('get_user_profile_image', {
            p_user_id: userId,
        });

        if (error) {
            console.error('프로필 이미지 조회 실패:', error);
            throw error;
        }

        return data?.[0] || null;
    } catch (error) {
        console.error('getUserProfileImage 에러:', error);
        return null;
    }
};

/**
 * 게시물 썸네일 이미지 조회
 */
export const getPostThumbnails = async (postId: string) => {
    try {
        const { data, error } = await supabase.rpc('get_post_thumbnails', {
            p_post_id: postId,
        });

        if (error) {
            console.error('썸네일 이미지 조회 실패:', error);
            throw error;
        }

        return data[0] || [];
    } catch (error) {
        console.error('getPostThumbnails 에러:', error);
        return [];
    }
};

/**
 * 파일 삭제
 */
export const deleteFile = async (fileId: string): Promise<boolean> => {
    try {
        const { error } = await supabase.from('files').delete().eq('id', fileId);

        if (error) {
            console.error('파일 삭제 실패:', error);
            throw error;
        }

        return true;
    } catch (error) {
        console.error('deleteFile 에러:', error);
        return false;
    }
};
