import { useAuth } from '../hooks/useAuth.ts';
import { Logout } from '../services/supabaseUsers.ts';

const HeaderUserProfile = () => {
    const { user, loading } = useAuth();

    const signOutHandler = async () => {
        await Logout();
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
