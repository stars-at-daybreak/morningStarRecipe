import { Link, useNavigate } from 'react-router-dom';
import { usePageSetup } from '../../hooks/usePageSetup';
import { useModal } from '../../hooks/useModal';
import useUserStore from '../../stores/useUserStore';
import Modal from '../../components/modal/Modal';
import { useEffect } from 'react';
import supabase from '../../services/supabaseClient';

const Mypage = () => {
    const navigate = useNavigate();
    const { user, clearUser } = useUserStore();
    const { isOpen, type, openModal, closeModal } = useModal();

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

    // 모달 확인 버튼 클릭
    const handleModalConfirm = async () => {
        if (type === 'LOGOUT') {
            // Supabase에서도 로그아웃
            await supabase.auth.signOut();
            clearUser();
            navigate('/'); // 메인화면으로
        } else if (type === 'LOGIN') {
            navigate('/login'); // 로그인 페이지로 이동
        }
        closeModal();
    };

    // 모달 취소 버튼 클릭 (LOGIN 모달에서 취소 시 메인화면으로)
    const handleModalCancel = () => {
        if (type === 'LOGIN') {
            navigate('/'); // 메인화면으로
        }
        closeModal();
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

            <Modal isOpen={isOpen} type={type} onClose={handleModalCancel} onConfirm={handleModalConfirm} />
        </div>
    );
};

export default Mypage;
