import { useEffect } from 'react';
import { useHeaderStore } from '../stores/useHeaderStore';
import type { PageInfo } from '../types/header.types';

export const usePageSetup = (pageInfo: PageInfo): void => {
    const setPageInfo = useHeaderStore(state => state.setPageInfo);

    useEffect(() => {
        setPageInfo({
            title: pageInfo.title,
            pageName: pageInfo.pageName,
            showBackButton: pageInfo.showBackButton ?? false,
        });
    }, [pageInfo.title, pageInfo.pageName, pageInfo.showBackButton, setPageInfo]);
};

//사용법
//  import { usePageSetup } from '../../hooks/useHeaderSetup';
//  usePageSetup({
//         title: '마이페이지',
//         pageName: 'mypage',
//         showBackButton: true, // 뒤로가기 버튼 표시
//     });
