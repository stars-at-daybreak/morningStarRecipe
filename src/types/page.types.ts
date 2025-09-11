export interface PageConfig {
    title: string;
    pageName: string;
    showBackButton?: boolean;
    isLoading?: boolean;
}

export interface PageState extends PageConfig {
    setPageConfig: (config: Partial<PageConfig>) => void;
    setTitle: (title: string) => void;
    setLoading: (loading: boolean) => void;
    resetPage: () => void;
}
