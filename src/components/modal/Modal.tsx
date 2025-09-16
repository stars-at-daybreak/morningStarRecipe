import type { ModalType } from './ModalContext';
import getModalContent from './getModalContent';
import styles from './modal.module.css';
import { logout } from '../../services/supabaseUsers.ts';

interface ModalProps {
    isOpen: boolean;
    type: ModalType | null;
    onClose: () => void;
    onConfirm?: () => void;
}

export default function Modal({ isOpen, type, onClose, onConfirm }: ModalProps) {
    if (!isOpen || !type) {
        return null;
    }

    const modalConfig = getModalContent(type);

    // 확인 버튼 클릭 처리
    const handleConfirm = async () => {
        if (onConfirm) {
            onConfirm();
            if (type === 'LOGOUT') {
                await logout();
            }
        }
        onClose();
    };

    return (
        <div className={styles.modal__backdrop}>
            <div className={styles.modal}>
                <div className={styles.modal__content}>
                    <h2 className={styles.modal__title}>{modalConfig.title}</h2>

                    {/* 인증번호 모달만 특별한 컴포넌트 렌더링 */}
                    {modalConfig.message && <p className={styles.modal__message}>{modalConfig.message}</p>}
                </div>

                <div className={styles.modal__button__area}>
                    {modalConfig.hasCancel && (
                        <button onClick={onClose} className={`${styles.modal__button} ${styles.modal__button__cancel}`}>
                            {modalConfig.cancelText}
                        </button>
                    )}

                    <button
                        onClick={handleConfirm}
                        className={`${styles.modal__button} ${styles.modal__button__confirm}`}
                    >
                        {modalConfig.confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
