import React, { useEffect, useState } from 'react';
import { verifyEmailCode } from '../../services/supabaseEmailAuth.ts';
import styles from './emailAuthModal.module.css';

const EmailAuthModal = ({
    handleModal,
    handleAuthConfirm,
    email,
}: {
    handleModal: (isOpen: boolean) => void;
    handleAuthConfirm: (isConfirm: boolean) => void;
    email: string;
}) => {
    const [code, setCode] = useState('');
    const [isHidden, setIsHidden] = useState(true);
    const [timeLeft, setTimeLeft] = useState<number>(600);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleConfirm = async (type: 'confirm' | 'cancel') => {
        if (type === 'confirm') {
            if (!code) {
                setIsHidden(false);
                return;
            }

            const isSuccess = await verifyEmailCode(email, code);

            if (isSuccess) {
                handleModal(false);
                handleAuthConfirm(true);
            } else {
                setIsHidden(false);
            }
        } else {
            handleModal(false);
        }
    };

    const handleInputCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputCode = e.target.value.replace(/[^0-9]/g, '');
        if (inputCode.length <= 6) {
            setCode(inputCode);
        }
    };

    useEffect(() => {
        if (timeLeft > -1) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === -1) {
            handleModal(false);
        }
    }, [timeLeft]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className={styles['modal-overlay']}>
            <div className={styles['auth-modal']}>
                <div className={styles['auth-modal__contents-box']}>
                    <p className={styles['auth-modal__contents']}>인증번호를 입력해주세요</p>
                    <time className={styles['auth-modal__timer']}>{formatTime(timeLeft)}</time>
                    <input
                        className={`${styles['auth-modal__input']} ${code.length === 6 ? styles['auth-modal__input--active'] : ''}`}
                        type='text'
                        inputMode='numeric'
                        pattern='[0-9]*'
                        value={code}
                        onChange={handleInputCode}
                        onKeyDown={(e) => {
                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                e.preventDefault();
                            }
                        }}
                    />
                    <span
                        className={isHidden ? styles['auth-modal__input-text'] : styles['auth-modal__input-text--warn']}
                    >
                        인증번호가 일치하지 않습니다.
                    </span>
                </div>
                <div className={styles['auth-modal__btn-group']}>
                    <button className={styles['auth-modal__btn']} type='button' onClick={() => handleConfirm('cancel')}>
                        취소
                    </button>
                    <div className={styles['auth-modal__btn-line']}></div>
                    <button
                        className={`${styles['auth-modal__btn']} ${code.length === 6 ? styles['auth-modal__btn--active'] : ''}`}
                        type='button'
                        onClick={() => handleConfirm('confirm')}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailAuthModal;
