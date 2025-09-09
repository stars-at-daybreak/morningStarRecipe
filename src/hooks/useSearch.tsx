import { useState, useCallback, useEffect } from 'react';
import type { Tables } from '../types/supabase';
import supabase from '../services/supabaseClient';
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

const useSearch = (options: UseSearchOptions) => {
    const { pageType, initialParams } = options;

    // 상태들
    const [searchList, setSearchList] = useState<Tables<'posts'>[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);

    // 기본 파라미터 생성
    const getDefaultParams = useCallback((): SearchParams => {
        switch (pageType) {
            case 'recipe':
                return {
                    pageType: 'recipe',
                    searchTerm: '',
                    category: '',
                    sortBy: 'recommended',
                };
            case 'share':
                return {
                    pageType: 'share',
                    searchTerm: '',
                    category: '',
                    shareStatus: 'all',
                };
            case 'all':
                return {
                    pageType: 'all',
                    searchTerm: '',
                    category: '',
                    postType: 'all',
                    sortBy: 'recommended',
                    shareStatus: 'all',
                };
            default:
                throw new Error(`Unsupported pageType: ${pageType}`);
        }
    }, [pageType]);

    // 현재 검색 파라미터
    const [searchParams, setSearchParams] = useState<SearchParams>(() => {
        const defaultParams = getDefaultParams();
        return { ...defaultParams, ...initialParams } as SearchParams;
    });

    // 페이지 타입 변경 시 파라미터 초기화
    useEffect(() => {
        if (!initialParams || Object.keys(initialParams).length === 0) {
            const defaultParams = getDefaultParams();
            setSearchParams(defaultParams);
        }
    }, [pageType, getDefaultParams]);

    // 검색 실행
    const executeSearch = useCallback(async (params: SearchParams) => {
        setLoading(true);
        setError(null);

        try {
            // 실제 API 호출 부분
            let query = supabase.from('posts').select('*', { count: 'exact' });

            // 페이지 타입별 기본 필터링
            if (params.pageType !== 'all') {
                query = query.eq('post_type', params.pageType);
            }

            // 검색어 필터링
            if (params.searchTerm) {
                query = query.or(`title.ilike.%${params.searchTerm}%`);
            }

            // 카테고리 필터링
            if (params.category) {
                query = query.eq('category', params.category);
            }

            // 페이지 타입별 추가 필터링 및 정렬
            if (params.pageType === 'recipe') {
                if (params.sortBy === 'popular') {
                    query = query.order('bookmark_count', { ascending: false });
                } else {
                    query = query.order('like_count', { ascending: false });
                }
            } else if (params.pageType === 'share') {
                if (params.shareStatus && params.shareStatus !== 'all') {
                    query = query.eq('share_status', params.shareStatus);
                }
                query = query.order('created_at', { ascending: false });
            } else if (params.pageType === 'all') {
                if (params.postType && params.postType !== 'all') {
                    query = query.eq('post_type', params.postType);
                }

                if (params.shareStatus && params.shareStatus !== 'all') {
                    query = query.or(`post_type.neq.share,share_status.eq.${params.shareStatus}`);
                }

                if (params.sortBy === 'popular') {
                    query = query.order('bookmark_count', { ascending: false });
                } else {
                    query = query.order('like_count', { ascending: false });
                }
            }

            const { data, error: searchError, count } = await query;

            if (searchError) throw searchError;

            setSearchList(data || []);
            setTotalCount(count || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.');
            setSearchList([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, []);

    // 파라미터 변경 시 검색 실행
    useEffect(() => {
        executeSearch(searchParams);
    }, [searchParams, executeSearch]);

    // 업데이트 함수들
    const updateSearchTerm = useCallback((searchTerm: string) => {
        setSearchParams(prev => ({ ...prev, searchTerm }));
    }, []);

    const updateCategory = useCallback((category: string) => {
        setSearchParams(prev => ({ ...prev, category }));
    }, []);

    const updateRecipeSortBy = useCallback(
        (sortBy: RecipeSortBy) => {
            if (pageType === 'recipe') {
                setSearchParams(prev => ({ ...prev, sortBy }) as RecipeSearchParams);
            }
        },
        [pageType]
    );

    const updateShareStatus = useCallback(
        (shareStatus: ShareStatus) => {
            if (pageType === 'share') {
                setSearchParams(prev => ({ ...prev, shareStatus }) as ShareSearchParams);
            } else if (pageType === 'all') {
                setSearchParams(prev => ({ ...prev, shareStatus }) as AllSearchParams);
            }
        },
        [pageType]
    );

    const updatePostType = useCallback(
        (postType: PostType) => {
            if (pageType === 'all') {
                setSearchParams(prev => ({ ...prev, postType }) as AllSearchParams);
            }
        },
        [pageType]
    );

    const updateAllSortBy = useCallback(
        (sortBy: RecipeSortBy) => {
            if (pageType === 'all') {
                setSearchParams(prev => ({ ...prev, sortBy }) as AllSearchParams);
            }
        },
        [pageType]
    );

    const resetSearch = useCallback(() => {
        const defaultParams = getDefaultParams();
        setSearchParams(defaultParams);
    }, [getDefaultParams]);

    const refetch = useCallback(() => {
        executeSearch(searchParams);
    }, [executeSearch, searchParams]);

    // 현재 값들 추출
    const currentRecipeSort = pageType === 'recipe' ? (searchParams as RecipeSearchParams).sortBy : undefined;
    const currentShareStatus =
        pageType === 'share' || pageType === 'all'
            ? (searchParams as ShareSearchParams | AllSearchParams).shareStatus
            : undefined;
    const currentPostType = pageType === 'all' ? (searchParams as AllSearchParams).postType : undefined;
    const currentAllSort = pageType === 'all' ? (searchParams as AllSearchParams).sortBy : undefined;

    return {
        // 검색 결과 데이터
        searchList,
        loading,
        error,
        totalCount,

        // 현재 페이지 정보
        pageType,

        // 현재 검색 파라미터
        searchParams,

        // 페이지별 특정 파라미터
        currentRecipeSort,
        currentShareStatus,
        currentPostType,
        currentAllSort,

        // 업데이트 함수들
        updateSearchTerm,
        updateCategory,
        updateRecipeSortBy,
        updateShareStatus,
        updatePostType,
        updateAllSortBy,

        // 유틸리티 함수들
        resetSearch,
        refetch,
    };
};

export default useSearch;
