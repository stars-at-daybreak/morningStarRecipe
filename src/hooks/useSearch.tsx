import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Tables } from '../types/supabase';
import { searchPosts } from '../services/supabasePosts';
import type {
    SearchParams,
    RecipeSearchParams,
    ShareSearchParams,
    AllSearchParams,
    UseSearchOptions,
} from '../types/search.types';

// 기본 파라미터 생성 함수
const createDefaultParams = (pageType: string, initialParams?: Partial<SearchParams>): SearchParams => {
    const baseParams = { searchTerm: '', category: '' };

    switch (pageType) {
        case 'recipe':
            return { pageType: 'recipe', ...baseParams, sortBy: 'recently', ...initialParams };
        case 'share':
            return { pageType: 'share', ...baseParams, shareStatus: 'all', ...initialParams };
        case 'all':
            return {
                pageType: 'all',
                ...baseParams,
                sortBy: 'recently',
                shareStatus: 'all',
                postType: 'all',
                ...initialParams,
            };
        default:
            throw new Error(`Unsupported pageType: ${pageType}`);
    }
};

// 상태 타입 정의
interface SearchState {
    searchList: Tables<'posts'>[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    totalCount: number;
    currentPage: number;
    hasMore: boolean;
    searchParams: SearchParams;
}

const useSearch = (options: UseSearchOptions) => {
    const { pageType, initialParams, enableInfiniteScroll = false, pageSize = 20 } = options;

    const initialEmptyState = useMemo((): SearchState => {
        const searchParams = createDefaultParams(pageType, initialParams);
        return {
            searchList: [],
            loading: false,
            loadingMore: false,
            error: null,
            totalCount: 0,
            currentPage: 1,
            hasMore: true,
            searchParams,
        };
    }, [pageType, initialParams]);

    const [state, setState] = useState<SearchState>(initialEmptyState);

    const executeSearch = useCallback(
        async (params: SearchParams, page: number = 1, append: boolean = false) => {
            try {
                if (append && enableInfiniteScroll) {
                    setState(prev => ({ ...prev, loadingMore: true, error: null }));
                }

                const paginationOptions = enableInfiniteScroll ? { page, pageSize } : undefined;
                const result = await searchPosts(params, paginationOptions);

                if (result.error) {
                    throw new Error(result.error);
                }

                const newData = result.data || [];
                const newTotalCount = result.count || 0;

                setState(prevState => {
                    let newSearchList: Tables<'posts'>[];

                    if (append) {
                        const existingIds = new Set(prevState.searchList.map(item => item.id));
                        const uniqueNewData = newData.filter(item => !existingIds.has(item.id));
                        newSearchList = [...prevState.searchList, ...uniqueNewData];
                    } else {
                        newSearchList = newData;
                    }

                    const currentTotal = newSearchList.length;
                    const hasMoreData = enableInfiniteScroll
                        ? currentTotal < newTotalCount && newData.length === pageSize && newData.length > 0
                        : false;

                    return {
                        ...prevState,
                        searchList: newSearchList,
                        loading: false,
                        loadingMore: false,
                        error: null,
                        totalCount: newTotalCount,
                        currentPage: append ? page : 1,
                        hasMore: hasMoreData,
                    };
                });
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.';
                console.error(errorMessage);

                setState(prevState => ({
                    ...prevState,
                    error: errorMessage,
                    loading: false,
                    loadingMore: false,
                    searchList: append ? prevState.searchList : [],
                    totalCount: append ? prevState.totalCount : 0,
                    hasMore: append ? prevState.hasMore : false,
                }));
            }
        },
        [enableInfiniteScroll, pageSize]
    );

    const loadMore = useCallback(() => {
        if (!enableInfiniteScroll || state.loadingMore || !state.hasMore || state.loading) {
            return;
        }
        const nextPage = state.currentPage + 1;
        executeSearch(state.searchParams, nextPage, true);
    }, [
        enableInfiniteScroll,
        state.loadingMore,
        state.hasMore,
        state.loading,
        state.currentPage,
        state.searchParams,
        executeSearch,
    ]);

    // 로딩 상태를 함께 업데이트
    const updateSearchParams = useCallback((newParams: Partial<SearchParams>) => {
        setState(prev => ({
            ...prev,
            searchParams: { ...prev.searchParams, ...newParams },
            loading: true,
        }));
    }, []);

    const resetSearch = useCallback(() => {
        const newSearchParams = createDefaultParams(pageType);
        updateSearchParams(newSearchParams);
    }, [pageType, updateSearchParams]);

    const refetch = useCallback(() => {
        updateSearchParams(state.searchParams);
    }, [state.searchParams, updateSearchParams]);

    // searchParams가 변경될 때마다 검색 실행
    useEffect(() => {
        executeSearch(state.searchParams, 1, false);
    }, [state.searchParams, executeSearch]);

    const currentRecipeSort = useMemo(
        () =>
            pageType === 'recipe' || pageType === 'all'
                ? (state.searchParams as RecipeSearchParams | AllSearchParams).sortBy
                : undefined,
        [pageType, state.searchParams]
    );

    const currentShareStatus = useMemo(
        () =>
            pageType === 'share' || pageType === 'all'
                ? (state.searchParams as ShareSearchParams | AllSearchParams).shareStatus
                : undefined,
        [pageType, state.searchParams]
    );

    const currentPostType = useMemo(
        () => (pageType === 'all' ? (state.searchParams as AllSearchParams).postType : undefined),
        [pageType, state.searchParams]
    );

    // 반환 객체 메모이제이션
    return useMemo(
        () => ({
            searchList: state.searchList,
            loading: state.loading,
            loadingMore: state.loadingMore,
            error: state.error,
            totalCount: state.totalCount,
            hasMore: state.hasMore,
            loadMore,
            currentPage: state.currentPage,
            pageType,
            searchParams: state.searchParams,
            currentRecipeCategory: state.searchParams.category,
            currentRecipeSort,
            currentShareStatus,
            currentPostType,
            updateSearchParams,
            resetSearch,
            refetch,
        }),
        [
            state,
            loadMore,
            pageType,
            currentRecipeSort,
            currentShareStatus,
            currentPostType,
            updateSearchParams,
            resetSearch,
            refetch,
        ]
    );
};

export default useSearch;
