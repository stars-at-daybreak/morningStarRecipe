import { useState, useCallback, useMemo } from 'react';
import type { Tables } from '../types/supabase';
import { searchPosts } from '../services/supabasePosts';
import type {
    RecipeSortBy,
    ShareStatus,
    PostType,
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
    isInitialized: boolean; // 첫 검색이 실행되었는지 확인
}

const useSearch = (options: UseSearchOptions) => {
    const { pageType, initialParams, enableInfiniteScroll = false, pageSize = 20 } = options;

    // 초기 빈 상태
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
            isInitialized: false,
        };
    }, [pageType, initialParams]);

    const [state, setState] = useState<SearchState>(initialEmptyState);

    // 검색 실행 함수
    const executeSearch = useCallback(
        async (params: SearchParams, page: number = 1, append: boolean = false) => {
            try {
                // 로딩 상태 설정
                setState(prev => ({
                    ...prev,
                    loading: !append,
                    loadingMore: append,
                    error: null,
                    isInitialized: true,
                }));

                if (append && enableInfiniteScroll) {
                    const requestedOffset = (page - 1) * pageSize;
                    if (state.totalCount > 0 && requestedOffset >= state.totalCount) {
                        setState(prev => ({
                            ...prev,
                            hasMore: false,
                            loadingMore: false,
                        }));
                        return;
                    }
                }

                const paginationOptions = enableInfiniteScroll ? { page, pageSize } : undefined;
                const result = await searchPosts(params, paginationOptions);

                if (result.error) {
                    throw new Error(result.error);
                }

                const newData = result.data || [];
                const newTotalCount = result.count || 0;

                // 모든 상태를 한 번에 업데이트
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
                        searchList: newSearchList,
                        loading: false,
                        loadingMore: false,
                        error: null,
                        totalCount: newTotalCount,
                        currentPage: append ? page : 1,
                        hasMore: hasMoreData,
                        searchParams: params,
                        isInitialized: true,
                    };
                });
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.';

                setState(prevState => ({
                    ...prevState,
                    error: errorMessage,
                    loading: false,
                    loadingMore: false,
                    searchList: append ? prevState.searchList : [],
                    totalCount: append ? prevState.totalCount : 0,
                    hasMore: append ? prevState.hasMore : false,
                    isInitialized: true,
                }));
            }
        },
        [enableInfiniteScroll, pageSize, state.totalCount]
    );

    // 초기 검색 실행 (수동)
    const initialize = useCallback(() => {
        if (!state.isInitialized) {
            executeSearch(state.searchParams, 1, false);
        }
    }, [state.isInitialized, state.searchParams, executeSearch]);

    // 검색 함수 (파라미터 변경 후 검색)
    const search = useCallback(
        (newParams?: Partial<SearchParams>) => {
            const searchParams = newParams ? { ...state.searchParams, ...newParams } : state.searchParams;
            executeSearch(searchParams, 1, false);
        },
        [state.searchParams, executeSearch]
    );

    // 더 많은 데이터 로드
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

    // 상태 업데이트 함수들 (검색은 자동 실행하지 않음)
    const updateSearchTerm = useCallback((searchTerm: string) => {
        setState(prev => {
            const newSearchParams =
                prev.searchParams.searchTerm === searchTerm ? prev.searchParams : { ...prev.searchParams, searchTerm };

            return prev.searchParams === newSearchParams ? prev : { ...prev, searchParams: newSearchParams };
        });
    }, []);

    const updateCategory = useCallback((category: string) => {
        setState(prev => {
            const newSearchParams =
                prev.searchParams.category === category ? prev.searchParams : { ...prev.searchParams, category };

            return prev.searchParams === newSearchParams ? prev : { ...prev, searchParams: newSearchParams };
        });
    }, []);

    const updateRecipeSortBy = useCallback(
        (sortBy: RecipeSortBy) => {
            if (pageType === 'recipe' || pageType === 'all') {
                setState(prev => {
                    const recipeParams = prev.searchParams as RecipeSearchParams | AllSearchParams;
                    const newSearchParams =
                        recipeParams.sortBy === sortBy ? prev.searchParams : { ...prev.searchParams, sortBy };

                    return prev.searchParams === newSearchParams ? prev : { ...prev, searchParams: newSearchParams };
                });
            }
        },
        [pageType]
    );

    const updateShareStatus = useCallback(
        (shareStatus: ShareStatus) => {
            if (pageType === 'share' || pageType === 'all') {
                setState(prev => {
                    const shareParams = prev.searchParams as ShareSearchParams | AllSearchParams;
                    const newSearchParams =
                        shareParams.shareStatus === shareStatus
                            ? prev.searchParams
                            : { ...prev.searchParams, shareStatus };

                    return prev.searchParams === newSearchParams ? prev : { ...prev, searchParams: newSearchParams };
                });
            }
        },
        [pageType]
    );

    const updatePostType = useCallback(
        (postType: PostType) => {
            if (pageType === 'all') {
                setState(prev => {
                    const allParams = prev.searchParams as AllSearchParams;
                    const newSearchParams =
                        allParams.postType === postType ? prev.searchParams : { ...prev.searchParams, postType };

                    return prev.searchParams === newSearchParams ? prev : { ...prev, searchParams: newSearchParams };
                });
            }
        },
        [pageType]
    );

    // 유틸리티 함수들
    const resetSearch = useCallback(() => {
        const newSearchParams = createDefaultParams(pageType);
        setState(prev => ({ ...prev, searchParams: newSearchParams }));
    }, [pageType]);

    const refetch = useCallback(() => {
        executeSearch(state.searchParams, 1, false);
    }, [state.searchParams, executeSearch]);

    // 계산된 값들
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
            // 데이터
            searchList: state.searchList,
            loading: state.loading,
            loadingMore: state.loadingMore,
            error: state.error,
            totalCount: state.totalCount,
            isInitialized: state.isInitialized,

            // 무한 스크롤 관련
            hasMore: state.hasMore,
            loadMore,
            currentPage: state.currentPage,

            // 현재 상태
            pageType,
            searchParams: state.searchParams,
            currentRecipeCategory: state.searchParams.category,
            currentRecipeSort,
            currentShareStatus,
            currentPostType,

            // 액션 함수들
            initialize, // 초기 검색 실행
            search, // 수동 검색
            updateSearchTerm,
            updateCategory,
            updateRecipeSortBy,
            updateShareStatus,
            updatePostType,
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
            initialize,
            search,
            updateSearchTerm,
            updateCategory,
            updateRecipeSortBy,
            updateShareStatus,
            updatePostType,
            resetSearch,
            refetch,
        ]
    );
};

export default useSearch;
