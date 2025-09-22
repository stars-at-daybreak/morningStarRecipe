import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/useUserStore';
import { withdraw } from '../../services/supabaseUsers';
import Modal from './Modal';
import EmailAuthModal from './EmailAuthModal';
import { ModalContext } from './ModalContext';
import type { ModalType, ModalDataMap } from './ModalContext';

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { clearUser } = useUserStore();

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: ModalType | null;
        title?: string;
        data: ModalDataMap[ModalType] | undefined;
    }>({
        isOpen: false,
        type: null,
        title: '',
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

    const openModal = <T extends ModalType>(type: T, data?: ModalDataMap[T], title?: string) => {
        setModalState({ isOpen: true, type, title, data });
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

    const handleConfirm = async () => {
        switch (modalState.type) {
            case 'LOGIN':
                navigate('/login');
                break;
            case 'LOGOUT':
                clearUser();
                navigate('/');
                break;
            case 'SUCCESS': {
                const data = modalState.data;
                if (data && typeof data === 'string') navigate(data, { replace: true });
                break;
            }
            case 'DELETE_ACCOUNT':
                try {
                    await withdraw();
                    clearUser();
                    // SUCCESS 모달로 회원탈퇴 완료 메시지 표시
                    openModal('SUCCESS', '/', '회원탈퇴가 완료되었습니다.');
                    return; // closeModal()을 호출하지 않음
                } catch (error) {
                    console.error('회원탈퇴 처리 중 오류:', error);
                    // openModal('FAIL', undefined, '회원탈퇴 처리 중 오류가 발생했습니다.');
                    return;
                }
                break;
            case 'DELETE':
                if (modalState.data && typeof modalState.data === 'function') {
                    (modalState.data as () => void)();
                }
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

            <Modal
                isOpen={modalState.isOpen}
                type={modalState.type}
                title={modalState.title}
                onClose={closeModal}
                onConfirm={handleConfirm}
            />

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
