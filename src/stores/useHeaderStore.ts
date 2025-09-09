import { create } from 'zustand';
import type { HeaderState, DeviceType } from '../types/header.types';

// 기본값 설정
const DEFAULT_TITLE = '메인페이지';
const DEFAULT_PAGE_NAME = 'home';
const DEFAULT_DEVICE_TYPE: DeviceType = 'mobile';

// 디바이스 타입 감지 함수
const detectDeviceType = (): DeviceType => {
    if (typeof window === 'undefined') return DEFAULT_DEVICE_TYPE;

    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    return 'tablet';
};

export const useHeaderStore = create<HeaderState>(set => ({
    title: DEFAULT_TITLE,
    pageName: DEFAULT_PAGE_NAME,
    deviceType: detectDeviceType(), // 초기값을 감지된 디바이스 타입으로 설정
    showBackButton: false,

    setTitle: (title: string) => set({ title }),

    setPageName: (pageName: string) => set({ pageName }),

    setDeviceType: (deviceType: DeviceType) => set({ deviceType }),

    setShowBackButton: (showBackButton: boolean) => set({ showBackButton }),

    // 여러 값을 한번에 설정
    setPageInfo: info =>
        set(state => ({
            ...state,
            ...info,
        })),

    resetHeader: () =>
        set({
            title: DEFAULT_TITLE,
            pageName: DEFAULT_PAGE_NAME,
            showBackButton: false,
        }),
}));
