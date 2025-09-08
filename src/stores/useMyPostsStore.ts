// stores/useMyPostsStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import supabase from '../services/supabaseClient';
import type { MyPost, MyPostsState } from '../types/myPosts.types';

export const useMyPostsStore = create<MyPostsState>()(
    devtools(
        set => ({
            // 초기 상태
            myPosts: [],
            loading: false,
            error: null,

            // 내가 작성한 게시글 목록 가져오기
            fetchMyPosts: async (userId: string) => {
                if (!userId) return;

                set({ loading: true, error: null });

                try {
                    const { data, error } = await supabase
                        .from('posts')
                        .select(
                            `
              *,
              categories:category_id (
                id,
                name
              )
            `
                        )
                        .eq('user_id', userId)
                        .eq('is_post_active', true)
                        .eq('is_user_active', true)
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    const myPosts = data as MyPost[];

                    set({
                        myPosts,
                        loading: false,
                        error: null,
                    });
                } catch (error) {
                    console.error('내 게시글 조회 실패:', error);
                    set({
                        error: error instanceof Error ? error.message : '내 게시글을 불러오는데 실패했습니다.',
                        loading: false,
                    });
                }
            },

            // 내 게시글 목록 초기화 (로그아웃 시 사용)
            clearMyPosts: () => {
                set({
                    myPosts: [],
                    loading: false,
                    error: null,
                });
            },
        }),
        {
            name: 'my-posts-store', // Redux DevTools에서 표시될 이름
        }
    )
);
