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
    const { pageType, initialParams } = options;

    // 중복 실행 방지
    const lastParamsRef = useRef<string>('');

    // 상태 관리
    const [searchList, setSearchList] = useState<Tables<'posts'>[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);

    // 검색 파라미터 초기화
    const [searchParams, setSearchParams] = useState<SearchParams>(() => createDefaultParams(pageType, initialParams));

    // 검색 실행 함수
    const executeSearch = useCallback(async (params: SearchParams) => {
        const paramsString = JSON.stringify(params);

        // 중복 실행 방지
        if (lastParamsRef.current === paramsString) {
            return;
        }

        lastParamsRef.current = paramsString;
        setLoading(true);
        setError(null);

        try {
            const result = await searchPosts(params);

            if (result.error) {
                throw new Error(result.error);
            }

            setSearchList(result.data || []);
            setTotalCount(result.count || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.');
            setSearchList([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, []);

    // 디바운스된 검색 실행
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            executeSearch(searchParams);
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
    }, [pageType]);

    const refetch = useCallback(() => {
        lastParamsRef.current = ''; // 강제 새로고침을 위해 초기화
        executeSearch(searchParams);
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
        loading,
        error,
        totalCount,

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
