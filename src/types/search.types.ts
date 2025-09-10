export type PageType = 'recipe' | 'share' | 'all';

export type RecipeSortBy = 'recommended' | 'popular' | 'recently';

export type ShareStatus = 'available' | 'reserved' | 'completed' | 'cancelled' | 'all';

export type PostType = 'recipe' | 'share' | 'all';

interface BaseSearchParams {
    searchTerm?: string;
    category?: string;
}

export interface RecipeSearchParams extends BaseSearchParams {
    pageType: 'recipe';
    sortBy?: RecipeSortBy;
}

export interface ShareSearchParams extends BaseSearchParams {
    pageType: 'share';
    shareStatus?: ShareStatus;
}

export interface AllSearchParams extends BaseSearchParams {
    pageType: 'all';
    postType?: PostType;
    sortBy?: RecipeSortBy;
    shareStatus?: ShareStatus;
}

export type SearchParams = RecipeSearchParams | ShareSearchParams | AllSearchParams;

export interface UseSearchOptions {
    pageType: PageType;
    initialParams?: Partial<SearchParams>;
}

export const getShareStatusLabel = (status: ShareStatus): string => {
    const labels = {
        all: '전체',
        available: '나눔 가능',
        reserved: '예약중',
        completed: '나눔 완료',
        cancelled: '취소됨',
    };
    return labels[status] || status;
};

export const getPostTypeLabel = (type: PostType): string => {
    const labels = {
        all: '전체',
        recipe: '레시피',
        share: '나눔',
    };
    return labels[type] || type;
};

export const getSortLabel = (sort: RecipeSortBy): string => {
    const labels = {
        recommended: '추천순',
        popular: '인기순',
        recently: '최신순',
    };
    return labels[sort] || sort;
};
