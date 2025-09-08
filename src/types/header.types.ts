export type DeviceType = 'mobile' | 'tablet';

export interface HeaderState {
    title: string;
    pageName: string;
    deviceType: DeviceType;
    showBackButton: boolean;
    setTitle: (title: string) => void;
    setPageName: (pageName: string) => void;
    setDeviceType: (deviceType: DeviceType) => void;
    setShowBackButton: (show: boolean) => void;
    setPageInfo: (info: Partial<Pick<HeaderState, 'title' | 'pageName' | 'showBackButton'>>) => void;
    resetHeader: () => void;
}

export interface PageInfo {
    title: string;
    pageName: string;
    showBackButton?: boolean;
}
