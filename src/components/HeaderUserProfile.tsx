import supabase from '../services/SupabaseClient.ts';
import { useAuth } from '../hooks/useAuth.ts';

const HeaderUserProfile = () => {
    const { user, loading } = useAuth();

    const signOutHandler = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('로그아웃 에러:', error.message);
                alert('로그아웃 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('로그아웃 예외:', error);
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            {loading && <p>로딩중...</p>}
            {user && (
                <>
                    <p>환영합니다, {user?.email}님!</p>
                    <p>
                        가입일:
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '정보 없음'}
                    </p>
                    <button onClick={signOutHandler}>로그아웃</button>
                </>
            )}
        </div>
    );
};

export default HeaderUserProfile;
