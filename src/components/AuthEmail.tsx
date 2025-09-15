import { useState } from 'react';
import { verifyEmailCode } from '../services/supabaseEmailAuth.ts';
import PasswordUpdate from './PasswordUpdate.tsx';

const AuthEmail = ({ email }: { email: string }) => {
    const [code, setCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    const handleAuthConfirm = async () => {
        if (!code) {
            alert('인증번호를 입력해주세요.');
            return;
        }

        const verified = await verifyEmailCode(email, code);

        if (verified) {
            setIsVerified(true);
        }
    };

    if (isVerified) {
        return <PasswordUpdate email={email} />;
    }

    return (
        <div>
            <p>인증번호를 입력해주세요</p>
            <input type='number' value={code} onChange={e => setCode(e.target.value)} placeholder='인증번호 6자리' />
            <button type='button' onClick={handleAuthConfirm}>
                확인
            </button>
        </div>
    );
};

export default AuthEmail;
