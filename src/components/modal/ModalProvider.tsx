import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/useUserStore';
import Modal from './Modal';
import EmailAuthModal from './EmailAuthModal';
import { ModalContext} from './ModalContext';
import type { ModalType, ModalDataMap } from './ModalContext';

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { clearUser } = useUserStore();

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: ModalType | null;
        data: ModalDataMap[ModalType] | undefined;
    }>({
        isOpen: false,
        type: null,
        data: undefined,
    });

    const [emailAuthState, setEmailAuthState] = useState<{
        isOpen: boolean;
        email: string;
        onConfirm: ((success: boolean) => void) | null;
    }>({
        isOpen: false,
        email: '',
        onConfirm: null,
    });

    const openModal = <T extends ModalType>(type: T, data?: ModalDataMap[T]) => {
        setModalState({ isOpen: true, type, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, type: null, data: undefined });
    };

    const openEmailAuth = (email: string, onConfirm: (success: boolean) => void) => {
        setEmailAuthState({ isOpen: true, email, onConfirm });
    };

    const closeEmailAuth = () => {
        setEmailAuthState({ isOpen: false, email: '', onConfirm: null });
    };

    const handleConfirm = () => {
        switch (modalState.type) {
            case 'LOGIN':
                navigate('/login');
                break;
            case 'LOGOUT':
                clearUser();
                navigate('/');
                break;
            case 'DELETE_ACCOUNT':
                navigate('/DeleteAccount');
                break;
            case 'CONFIRM_DISCARD_POST':
                if (modalState.data && typeof modalState.data === 'function') {
                    (modalState.data as () => void)();
                }
                break;
        }
        closeModal();
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal, openEmailAuth }}>
            {children}

            <Modal isOpen={modalState.isOpen} type={modalState.type} onClose={closeModal} onConfirm={handleConfirm} />

            {emailAuthState.isOpen && (
                <EmailAuthModal
                    handleModal={(isOpen: boolean) => !isOpen && closeEmailAuth()}
                    handleAuthConfirm={(success: boolean) => {
                        emailAuthState.onConfirm?.(success);
                        if (success) closeEmailAuth();
                    }}
                    email={emailAuthState.email}
                />
            )}
        </ModalContext.Provider>
    );
};

export default ModalProvider;
