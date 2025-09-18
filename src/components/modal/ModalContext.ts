import { createContext, useContext } from 'react';

export type ModalType =
    | 'LOGOUT'
    | 'LOGIN'
    | 'DELETE'
    | 'SUCCESS'
    | 'FAIL'
    | 'DELETE_ACCOUNT'
    | 'CONFIRM_DISCARD_POST'
    | 'NOTIFY_ACCOUNT_EXISTS'
    | 'GUIDE_EMAIL_SENT';

export type ModalDataMap = {
    LOGOUT: undefined;
    LOGIN: undefined;
    DELETE: (() => void) | undefined;
    SUCCESS: string | undefined;
    FAIL: undefined;
    DELETE_ACCOUNT: undefined;
    CONFIRM_DISCARD_POST: (() => void) | undefined;
    NOTIFY_ACCOUNT_EXISTS: undefined;
    GUIDE_EMAIL_SENT: undefined;
};

export interface ModalContextType {
    openModal: <T extends ModalType>(type: T, data?: ModalDataMap[T], title?: string) => void;
    closeModal: () => void;
    openEmailAuth: (email: string, onConfirm: (success: boolean) => void) => void;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }
    return context;
};
