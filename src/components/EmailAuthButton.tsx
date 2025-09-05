import { sendVerificationCode } from '../services/supabaseEmailAuth.ts';

const EmailAuthButton = ({ email }: { email: string }) => {
    const handleEmailAuth = async () => {
        const result = await sendVerificationCode(email);
        alert(result.success && result.message);
    };

    return (
        <div>
            <button type='button' onClick={handleEmailAuth}>
                인증
            </button>
        </div>
    );
};

export default EmailAuthButton;
