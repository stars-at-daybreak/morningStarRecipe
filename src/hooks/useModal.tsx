import { useState } from 'react';

export type ModalType =
    | 'LOGOUT' // 로그아웃
    | 'LOGIN' // 로그인
    | 'DELETE_ACCOUNT' // 회원탈퇴
    | 'CONFIRM_DISCARD_POST' // 게시물 작성 중 뒤로가기 경고
    | 'PROMPT_VERIFICATION_CODE' // 인증번호 입력
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
