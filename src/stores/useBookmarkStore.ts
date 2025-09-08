import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import supabase from '../services/supabaseClient';
import type { BookmarkState } from '../types/bookmark.types';
import type { BookmarkedPost } from '../types/bookmark.types';
export const useBookmarkStore = create<BookmarkState>()(
    devtools(
        set => ({
            // 초기 상태
            bookmarks: [],
            loading: false,
            error: null,
            // 찜한 게시글 목록 가져오기
            fetchBookmarks: async (userId: string) => {
                if (!userId) return;
                set({ loading: true, error: null });
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
                        .order('created_at', { ascending: false });
                    if (error) throw error;
                    const bookmarks = data as BookmarkedPost[];
                    set({
                        bookmarks,
                        loading: false,
                        error: null,
                    });
                } catch (error) {
                    console.error('찜 목록 조회 실패:', error);
                    set({
                        error: error instanceof Error ? error.message : '찜 목록을 불러오는데 실패했습니다.',
                        loading: false,
                    });
                }
            },

            // 찜 목록 초기화 (로그아웃 시 사용)
            clearBookmarks: () => {
                set({
                    bookmarks: [],
                    loading: false,
                    error: null,
                });
            },
        }),
        {
            name: 'bookmark-store', // Redux DevTools에서 표시될 이름
        }
    )
);
