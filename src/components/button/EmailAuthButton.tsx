import { useState } from 'react';
import { checkEmailExists } from '../../services/supabaseUsers.ts';
import { EmailAlreadyExistsError } from '../../error/EmailAlreadyExistsError.ts';
import { sendVerificationCode } from '../../services/supabaseEmailAuth.ts';

const EmailAuthButton = ({
    handleModal,
    isConfirm,
    email,
}: {
    handleModal: (isOpen: boolean) => void;
    isConfirm: boolean;
    email: string;
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailAuth = async () => {
        if (isLoading) return;
        if (!email) return;

        try {
            setIsLoading(true);

            const emailExists = await checkEmailExists(email);
            if (emailExists) throw new EmailAlreadyExistsError('이미 가입된 이메일입니다.');

            const result = await sendVerificationCode(email);

            if (result.success) {
                handleModal(true);
            } else {
                alert(result.message);
            }
        } catch (error) {
            if (error instanceof EmailAlreadyExistsError) {
                alert(error.message);
            } else {
                alert('인증 요청 중 오류가 발생했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button type='button' onClick={handleEmailAuth} disabled={isLoading || isConfirm}>
                {isLoading ? '전송 중' : isConfirm ? '인증완료' : '인증하기'}
            </button>
        </>
    );
};

export default EmailAuthButton;
