import { useState, useCallback, useEffect, useRef } from 'react';
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
            return { pageType: 'recipe', ...baseParams, sortBy: 'recommended', ...initialParams };
        case 'share':
            return { pageType: 'share', ...baseParams, shareStatus: 'all', ...initialParams };
        case 'all':
            return {
                pageType: 'all',
                ...baseParams,
                postType: 'all',
                sortBy: 'recommended',
                shareStatus: 'all',
                ...initialParams,
            };
        default:
            throw new Error(`Unsupported pageType: ${pageType}`);
    }
};

const useSearch = (options: UseSearchOptions) => {
    const { pageType, initialParams, enableInfiniteScroll = false, pageSize = 20 } = options;

    // 중복 실행 방지
    const lastParamsRef = useRef<string>('');

    // 상태 관리
    const [searchList, setSearchList] = useState<Tables<'posts'>[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);

    // 무한 스크롤 관련 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // 검색 파라미터 초기화
    const [searchParams, setSearchParams] = useState<SearchParams>(() => createDefaultParams(pageType, initialParams));

    // 검색 실행 함수
    // executeSearch 함수 수정
    const executeSearch = useCallback(
        async (params: SearchParams, page: number = 1, append: boolean = false) => {
            const paramsString = JSON.stringify({ ...params, page });

            if (!append && lastParamsRef.current === paramsString) {
                return;
            }

            if (!append) {
                lastParamsRef.current = paramsString;
            } else {
                setLoadingMore(true);
            }

            setError(null);

            try {
                const paginationOptions = enableInfiniteScroll ? { page, pageSize } : undefined;

                const result = await searchPosts(params, paginationOptions);

                if (result.error) {
                    throw new Error(result.error);
                }

                const newData = result.data || [];

                if (append) {
                    setSearchList(prev => [...prev, ...newData]);
                } else {
                    setSearchList(newData);
                }

                setTotalCount(result.count || 0);

                if (enableInfiniteScroll) {
                    // 받아온 데이터 길이로 판단
                    const hasMoreData = newData.length === pageSize;
                    setHasMore(hasMoreData);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.');
                if (!append) {
                    setSearchList([]);
                    setTotalCount(0);
                    setHasMore(false);
                }
            } finally {
                if (append) {
                    setLoadingMore(false);
                }
            }
        },
        [enableInfiniteScroll, pageSize]
    );

    // 더 많은 데이터 로드
    const loadMore = useCallback(() => {
        if (!enableInfiniteScroll || loadingMore || !hasMore) {
            return;
        }

        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        executeSearch(searchParams, nextPage, true);
    }, [enableInfiniteScroll, loadingMore, hasMore, currentPage, searchParams, executeSearch]);

    // 디바운스된 검색 실행
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // 새로운 검색이므로 페이지를 1로 리셋
            setCurrentPage(1);
            setHasMore(true);
            executeSearch(searchParams, 1, false);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchParams, executeSearch]);

    // 상태 업데이트 함수들
    const updateSearchTerm = useCallback((searchTerm: string) => {
        setSearchParams(prev => (prev.searchTerm === searchTerm ? prev : { ...prev, searchTerm }));
    }, []);

    const updateCategory = useCallback((category: string) => {
        setSearchParams(prev => (prev.category === category ? prev : { ...prev, category }));
    }, []);

    const updateRecipeSortBy = useCallback(
        (sortBy: RecipeSortBy) => {
            if (pageType === 'recipe') {
                setSearchParams(prev => {
                    const recipeParams = prev as RecipeSearchParams;
                    return recipeParams.sortBy === sortBy ? prev : { ...prev, sortBy };
                });
            }
        },
        [pageType]
    );

    const updateShareStatus = useCallback(
        (shareStatus: ShareStatus) => {
            if (pageType === 'share' || pageType === 'all') {
                setSearchParams(prev => {
                    const shareParams = prev as ShareSearchParams | AllSearchParams;
                    return shareParams.shareStatus === shareStatus ? prev : { ...prev, shareStatus };
                });
            }
        },
        [pageType]
    );

    const updatePostType = useCallback(
        (postType: PostType) => {
            if (pageType === 'all') {
                setSearchParams(prev => {
                    const allParams = prev as AllSearchParams;
                    return allParams.postType === postType ? prev : { ...prev, postType };
                });
            }
        },
        [pageType]
    );

    const updateAllSortBy = useCallback(
        (sortBy: RecipeSortBy) => {
            if (pageType === 'all') {
                setSearchParams(prev => {
                    const allParams = prev as AllSearchParams;
                    return allParams.sortBy === sortBy ? prev : { ...prev, sortBy };
                });
            }
        },
        [pageType]
    );

    // 유틸리티 함수들
    const resetSearch = useCallback(() => {
        setSearchParams(createDefaultParams(pageType));
        setCurrentPage(1);
        setHasMore(true);
    }, [pageType]);

    const refetch = useCallback(() => {
        lastParamsRef.current = ''; // 강제 새로고침을 위해 초기화
        setCurrentPage(1);
        setHasMore(true);
        executeSearch(searchParams, 1, false);
    }, [executeSearch, searchParams]);

    // 현재 상태 값들
    const currentRecipeSort = pageType === 'recipe' ? (searchParams as RecipeSearchParams).sortBy : undefined;
    const currentShareStatus =
        pageType === 'share' || pageType === 'all'
            ? (searchParams as ShareSearchParams | AllSearchParams).shareStatus
            : undefined;
    const currentPostType = pageType === 'all' ? (searchParams as AllSearchParams).postType : undefined;
    const currentAllSort = pageType === 'all' ? (searchParams as AllSearchParams).sortBy : undefined;

    return {
        // 데이터
        searchList,
        loadingMore,
        error,
        totalCount,

        // 무한 스크롤 관련
        hasMore,
        loadMore,
        currentPage,

        // 현재 상태
        pageType,
        searchParams,
        currentRecipeSort,
        currentShareStatus,
        currentPostType,
        currentAllSort,

        // 액션 함수들
        updateSearchTerm,
        updateCategory,
        updateRecipeSortBy,
        updateShareStatus,
        updatePostType,
        updateAllSortBy,
        resetSearch,
        refetch,
    };
};

export default useSearch;
