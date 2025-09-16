import { Link } from 'react-router-dom';
import { usePageSetup } from '../../hooks/usePageSetup';
import { useModal } from '../../components/modal/ModalContext';
import useUserStore from '../../stores/useUserStore';
import { useEffect } from 'react';

const Mypage = () => {
    const { user } = useUserStore();
    const { openModal } = useModal();

    usePageSetup({
        title: '마이페이지',
        pageName: 'mypage',
        showBackButton: false,
    });

    // 로그인 안 되어있으면 로그인 모달 띄우기
    useEffect(() => {
        if (!user) {
            openModal('LOGIN');
        }
    }, [user, openModal]);

    // 로그아웃 버튼 클릭
    const handleLogoutClick = () => {
        openModal('LOGOUT');
    };

    return (
        <div>
            <Link to='/mypage/edit'>회원정보 수정</Link>
            <div>
                <Link to={'/DeleteAccount'}>회원탈퇴</Link>
                <span className=''></span>
                <button type='button' onClick={handleLogoutClick}>
                    로그아웃
                </button>
            </div>
        </div>
    );
};

export default Mypage;
