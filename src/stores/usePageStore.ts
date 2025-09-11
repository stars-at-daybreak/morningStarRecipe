import { create } from 'zustand';
import type { PageState, PageConfig } from '../types/page.types';

const DEFAULT_CONFIG: PageConfig = {
    title: '메인페이지',
    pageName: 'home',
    showBackButton: false,
    isLoading: false,
};

export const usePageStore = create<PageState>(set => ({
    ...DEFAULT_CONFIG,

    setPageConfig: config =>
        set(state => ({
            ...state,
            ...config,
        })),

    setTitle: title => set({ title }),

    setLoading: isLoading => set({ isLoading }),

    resetPage: () => set(DEFAULT_CONFIG),
}));
