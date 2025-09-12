import { useState, useRef } from 'react';
import type { ModalType } from '../../hooks/useModal';
import getModalContent from './getModalContent';
import styles from './modal.module.css';
import VerifyCodeContent from './VerifyCodeContent';
import type { VerifyCodeContentRef } from './VerifyCodeContent';

interface ModalProps {
    isOpen: boolean;
    type: ModalType | null;
    onClose: () => void;
    onConfirm?: () => void;
}

export default function Modal({ isOpen, type, onClose, onConfirm }: ModalProps) {
    // 인증번호 모달 전용 상태
    const [isCodeComplete, setIsCodeComplete] = useState(false);
    const [currentCode, setCurrentCode] = useState('');
    const verifyRef = useRef<VerifyCodeContentRef>(null);

    // 올바른 인증번호 (실제로는 서버에서 받아와야 함)
    const correctCode = '123456';

    if (!isOpen || !type) {
        return null;
    }

    const modalConfig = getModalContent(type);

    // 인증번호 입력 상태 변경시 호출되는 함수
    const handleCodeComplete = (code: string) => {
        setCurrentCode(code);
        setIsCodeComplete(code.length === 6); // 6자리인지 체크해서 상태 업데이트
    };

    // 확인 버튼 클릭 처리
    const handleConfirm = () => {
        // 인증번호 모달인 경우 특별 처리
        if (type === 'PROMPT_VERIFICATION_CODE') {
            // 6자리 미완성시
            if (!isCodeComplete) {
                verifyRef.current?.setError('인증번호 6자리를 입력해주세요.');
                return;
            }

            // 인증번호 검증
            if (currentCode === correctCode) {
                // 성공: 모달 닫기
                if (onConfirm) onConfirm();
                onClose();
            } else {
                // 실패: 에러 메시지 표시
                verifyRef.current?.setError('인증번호가 일치하지 않습니다.');
            }
        } else {
            // 일반 모달: 바로 확인 처리
            if (onConfirm) onConfirm();
            onClose();
        }
    };

    // 확인 버튼 클래스명 결정
    const getConfirmButtonClass = () => {
        let className = `${styles.modal__button}`;

        if (type === 'PROMPT_VERIFICATION_CODE') {
            // 인증번호 모달: 특별한 스타일 적용
            className += ` ${styles.modal__button__confirm__verify}`;
            if (isCodeComplete) {
                className += ` ${styles.modal__button__confirm__verify__active}`;
            }
        } else {
            // 일반 모달: 기본 초록색 스타일
            className += ` ${styles.modal__button__confirm}`;
        }

        return className;
    };

    return (
        <div className={styles.modal__backdrop}>
            <div className={styles.modal}>
                <div className={styles.modal__content}>
                    <h2 className={styles.modal__title}>{modalConfig.title}</h2>

                    {/* 인증번호 모달만 특별한 컴포넌트 렌더링 */}
                    {type === 'PROMPT_VERIFICATION_CODE' ? (
                        <VerifyCodeContent ref={verifyRef} onCodeComplete={handleCodeComplete} />
                    ) : (
                        modalConfig.message && <p className={styles.modal__message}>{modalConfig.message}</p>
                    )}
                </div>

                <div className={styles.modal__button__area}>
                    {modalConfig.hasCancel && (
                        <button onClick={onClose} className={`${styles.modal__button} ${styles.modal__button__cancel}`}>
                            {modalConfig.cancelText}
                        </button>
                    )}

                    <button onClick={handleConfirm} className={getConfirmButtonClass()}>
                        {modalConfig.confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
