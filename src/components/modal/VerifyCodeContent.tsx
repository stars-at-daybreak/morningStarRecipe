import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './modal.module.css';

interface VerifyCodeContentProps {
    onCodeComplete?: (code: string) => void;
}

export interface VerifyCodeContentRef {
    setError: (message: string) => void;
    getCode: () => string;
    isComplete: () => boolean;
}

const VerifyCodeContent = forwardRef<VerifyCodeContentRef, VerifyCodeContentProps>(({ onCodeComplete }, ref) => {
    const [code, setCode] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(600); // 10분
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // 타이머 로직
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    // 6자리 완성시 부모에게 알림 + 입력 변화시마다 알림
    useEffect(() => {
        if (onCodeComplete) {
            onCodeComplete(code); // 현재 코드 상태를 항상 부모에게 전달
        }
    }, [code, onCodeComplete]);

    // 시간 포맷팅 (10:00 -> 9:59 -> ... -> 0:00)
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // 숫자만 입력 허용
    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 6) {
            setCode(value);
            // 입력 중에는 에러 상태 초기화
            if (isError) {
                setIsError(false);
                setErrorMessage('');
            }
        }
    };

    // 에러 설정 함수 (Modal에서 호출)
    const setError = (message: string) => {
        setIsError(true);
        setErrorMessage(message);
    };

    // ref를 통해 외부에서 접근 가능한 메서드들
    useImperativeHandle(ref, () => ({
        setError,
        getCode: () => code,
        isComplete: () => code.length === 6,
    }));

    // input 클래스명 결정
    const getInputClassName = () => {
        let className = styles.modal__verify__code__input;

        if (isError) {
            className += ` ${styles.modal__verify__code__input__error}`;
        } else if (code.length === 6) {
            className += ` ${styles.modal__verify__code__input__completed}`;
        }

        return className;
    };

    return (
        <div className={styles.modal__verify__container}>
            {/* 10분 타이머 */}
            <div className={styles.modal__verify__timer}>{formatTime(timeLeft)}</div>

            {/* 인증번호 입력 필드 */}
            <div className={styles.modal__verify__input__container}>
                <input
                    type='text'
                    value={code}
                    onChange={handleCodeChange}
                    placeholder=''
                    maxLength={6}
                    className={getInputClassName()}
                />

                {/* 에러 메시지 */}
                {isError && <div className={styles.modal__error__message}>{errorMessage}</div>}
            </div>
        </div>
    );
});

VerifyCodeContent.displayName = 'VerifyCodeContent';

export default VerifyCodeContent;
