import supabase from '../../services/supabaseClient.ts';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 혹은 Next.js useRouter

export const KakaoLoginButton = () => {
    const navigate = useNavigate();

    // 로그인 후 콜백 페이지에서 세션을 복구
    useEffect(() => {
        const handleRedirect = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) console.error('Session error:', error);

            // 성공하면 원하는 페이지(예: 대시보드)로 이동
            if (data.session) navigate('/');
        };

        // Supabase는 URL에 `?code=` 혹은 `?access_token=` 파라미터가 있으면 자동으로
        // 토큰을 교환하고 세션을 저장한다.
        handleRedirect();
    }, [navigate]);

    const loginWithKakao = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao', // <-- 여기만 바꾸면 된다
            // 로컬 개발이면 `redirectTo` 옵션을 명시적으로 지정 가능
            // redirectTo: 'http://localhost:5173', // (선택)
        });
        if (error) console.error('Kakao login error:', error);
    };

    return (
        <button
            type='button'
            onClick={loginWithKakao}
            style={{
                background: '#FEE500',
                color: '#3c1e1e',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
            }}
        >
            카카오로 로그인
        </button>
    );
};
