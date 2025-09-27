import { useEffect } from 'react';
import { usePageStore } from '../stores/usePageStore';
import type { PageConfig } from '../types/page.types';

export const usePageActions = () => {
    return usePageStore(state => ({
        setTitle: state.setTitle,
        setLoading: state.setLoading,
        resetPage: state.resetPage,
    }));
};

export const usePageSetup = (config: PageConfig) => {
    const setPageConfig = usePageStore(state => state.setPageConfig);

    useEffect(() => {
        setPageConfig(config);
    }, [config.title, config.pageName, config.showBackButton, config.isLoading, setPageConfig]);
};

//사용법
//  import { usePageSetup } from '../../hooks/useHeaderSetup';
//  usePageSetup({
//         title: '마이페이지',
//         pageName: 'mypage',
//         showBackButton: true, // 뒤로가기 버튼 표시
//     });
