import { sendVerificationCode } from '../services/supabaseEmailAuth.ts';
import { useState } from 'react';
import AuthEmail from './AuthEmail.tsx';

const EmailAuthButton = ({ email }: { email: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showAuthEmail, setShowAuthEmail] = useState(false);

    const handleEmailAuth = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);

            const result = await sendVerificationCode(email);

            if (result.success) {
                alert(result.message);
                setShowAuthEmail(true);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('인증 요청 실패:', error);
            alert('인증 요청 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    if (showAuthEmail) {
        return <AuthEmail email={email} />;
    }

    return (
        <div>
            <button type='button' onClick={handleEmailAuth} disabled={isLoading}>
                {isLoading ? '전송 중...' : '인증'}
            </button>
        </div>
    );
};

export default EmailAuthButton;
