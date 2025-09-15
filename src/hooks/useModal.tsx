import { useState } from 'react';

export type ModalType =
    | 'LOGOUT' // 로그아웃
    | 'LOGIN' // 로그인
    | 'DELETE_ACCOUNT' // 회원탈퇴
    | 'CONFIRM_DISCARD_POST' // 게시물 작성 중 뒤로가기 경고
    | 'NOTIFY_ACCOUNT_EXISTS' // 이미 존재하는 계정
    | 'GUIDE_EMAIL_SENT'; // 이메일 전송 안내

interface ModalState<T = unknown> {
    isOpen: boolean;
    type: ModalType | null;
    data?: T;
}

export function useModal<T = unknown>() {
    // 모달 현재 상태 관리
    const [modalState, setModalState] = useState<ModalState<T>>({
        isOpen: false,
        type: null,
        data: undefined,
    });

    const openModal = (type: ModalType, data?: T): void => {
        setModalState({
            isOpen: true,
            type: type,
            data: data,
        });
    };

    const closeModal = (): void => {
        setModalState({
            isOpen: false,
            type: null,
            data: undefined,
        });
    };

    return {
        isOpen: modalState.isOpen,
        type: modalState.type,
        data: modalState.data,
        openModal,
        closeModal,
    };
}

/* 모달 사용법

// 1. import
import { useModal } from '../hooks/useModal';
import useUserStore from '../stores/useUserStore';
import Modal from '../components/modal/Modal';

// 2. 훅 사용
const { user } = useUserStore();
const { isOpen, type, openModal, closeModal } = useModal();

// 3. 핸들러 함수
const handleModalConfirm = () => {
    if (type === 'LOGIN') {
        navigate('/login');
    }
    closeModal();
};

// 4. 모달 열기 방법들
// 방법 1: 단순하게 열기
openModal('LOGIN');

// 방법 2: 조건부로 열기 (클릭 이벤트에서)
onClick={!user ? (e) => {
    e.preventDefault();
    openModal('LOGIN');
} : undefined}


// 5. JSX에 추가
<Modal 
    isOpen={isOpen} 
    type={type} 
    onClose={closeModal} 
    onConfirm={handleModalConfirm} 
/>
*/
