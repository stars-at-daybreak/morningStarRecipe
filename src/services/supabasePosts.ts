import supabase from './supabaseClient.ts';
import type { SearchParams, RecipeSearchParams, ShareSearchParams, AllSearchParams } from '../types/search.types';
import type { TablesInsert, TablesUpdate } from '../types/supabase.ts';
import type { PostWithUserNickname } from '../types/posts.type.ts';
import type { BookmarkedPost } from '../types/bookmark.types';
import type { Tables } from '../types/supabase';
type Post = Tables<'posts'>;
export const createPost = async (post: TablesInsert<'posts'>): Promise<string | null> => {
    try {
        const { data, error } = await supabase.from('posts').insert(post).select('id').single();
        if (error) throw error;
        return data?.id || null;
    } catch (error) {
        console.error('게시글 등록 중 에러 발생:', error);
        return null;
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
/**
 * 좋아요 수 기준 상위 3개 인기 게시글 조회
 */
export const selectPostsLikeTop3 = async (): Promise<Post[] | null> => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`*`)
            .eq('is_post_active', true)
            .order('like_count', { ascending: false })
            .limit(3);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('인기게시글 조회 중 에러 발생:', error);
        return null;
    }
};

/**
 * 최신 게시물 상위 6개 조회
 */
export const selectRecentPostsTOP6 = async (): Promise<Post[] | null> => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`*`)
            .eq('is_post_active', true)
            .eq('post_type', 'recipe')
            .order('created_at', { ascending: false })
            .limit(6);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('최근게시물 조회 중 에러 발생:', error);
        return null;
    }
};

/**
 * 공유 타입 게시물 상위 3개 조회
 */
export const selectSharePostsTOP3 = async (): Promise<Post[] | null> => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`*`)
            .eq('post_type', 'share')
            .eq('is_post_active', true)
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('공유게시물 조회 중 에러 발생:', error);
        return null;
    }
};
/**
 * 내가찜한 게시물 조회
 */
export const selectBookmarksByUserId = async (userId: string): Promise<BookmarkedPost[] | null> => {
    try {
        const { data, error } = await supabase
            .from('post_bookmarks')
            .select(
                `*,
                posts:post_id (
                    *,
                    categories:category_id (
                        name
                    )
                )`
            )
            .eq('user_id', userId)
            .eq('posts.is_post_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data as BookmarkedPost[];
    } catch (error) {
        console.error('찜 목록 조회 중 에러 발생:', error);
        return null;
    }
};
/**
 * 내가찜한 게시물 조회
 */
export const selectMyPostsByUserId = async (userId: string): Promise<Post[] | null> => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(
                `*,
                categories:category_id (
                    id,
                    name
                )`
            )
            .eq('user_id', userId)
            .eq('is_post_active', true)
            .eq('is_user_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data as Post[];
    } catch (error) {
        console.error('찜 목록 조회 중 에러 발생:', error);
        return null;
    }
};
/**
 * 검색 쿼리 빌더
 */
const buildSearchQuery = (params: SearchParams, options?: { page?: number; pageSize?: number }) => {
    let query = supabase.from('posts').select('*', { count: 'exact' });
    query = query.eq('is_post_active', true);

    // 기본 필터링
    if (params.pageType !== 'all') {
        query = query.eq('post_type', params.pageType);
    }

    if (params.searchTerm) {
        query = query.or(`title.ilike.%${params.searchTerm}%`);
    }

    if (params.category) {
        query = query.eq('category_id', params.category);
    }

    // 페이지 타입별 정렬 및 필터링
    if (params.pageType === 'recipe') {
        const recipeParams = params as RecipeSearchParams;
        switch (recipeParams.sortBy) {
            case 'popular':
                query = query.order('bookmark_count', { ascending: false });
                break;
            case 'recommended':
                query = query.order('like_count', { ascending: false });
                break;
            case 'recently':
                query = query.order('created_at', { ascending: false });
                break;
        }
    } else if (params.pageType === 'share') {
        const shareParams = params as ShareSearchParams;
        if (shareParams.shareStatus && shareParams.shareStatus !== 'all') {
            query = query.eq('share_status', shareParams.shareStatus);
        }
        query = query.order('created_at', { ascending: false });
    } else if (params.pageType === 'all') {
        const allParams = params as AllSearchParams;

        if (allParams.postType && allParams.postType !== 'all') {
            query = query.eq('post_type', allParams.postType);
        }

        if (allParams.shareStatus && allParams.shareStatus !== 'all') {
            query = query.or(`post_type.neq.share,share_status.eq.${allParams.shareStatus}`);
        }

        if (allParams.sortBy === 'popular') {
            query = query.order('bookmark_count', { ascending: false });
        } else {
            query = query.order('like_count', { ascending: false });
        }
    }

    // 페이지네이션 적용
    if (options?.page && options?.pageSize) {
        const from = (options.page - 1) * options.pageSize;
        const to = from + options.pageSize - 1;
        query = query.range(from, to);
    }

    return query;
};

/**
 * 게시물 검색 실행
 */
export const searchPosts = async (
    params: SearchParams,
    options?: { page?: number; pageSize?: number }
): Promise<{
    data: Tables<'posts'>[] | null;
    count: number | null;
    error: string | null;
}> => {
    try {
        const query = buildSearchQuery(params, options);
        const { data, error: searchError, count } = await query;

        if (searchError) {
            throw searchError;
        }

        return {
            data: data || [],
            count: count || 0,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            count: null,
            error: err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.',
        };
    }
};
