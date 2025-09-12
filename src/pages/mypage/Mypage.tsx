import { Link, useNavigate } from 'react-router-dom';
import { usePageSetup } from '../../hooks/usePageSetup';
import { useModal } from '../../hooks/useModal';
import useUserStore from '../../stores/useUserStore';
import Modal from '../../components/modal/Modal';

const Mypage = () => {
    const navigate = useNavigate();
    const { clearUser } = useUserStore(); // 로그아웃 함수 가져오기
    const { isOpen, type, openModal, closeModal } = useModal(); // 모달 훅

    usePageSetup({
        title: '마이페이지',
        pageName: 'mypage',
        showBackButton: false, // 뒤로가기 버튼 표시
    });

    // 로그아웃 버튼 클릭 처리
    const handleLogoutClick = () => {
        openModal('LOGOUT'); // 로그아웃 모달 열기
    };

    // 모달 확인 버튼 클릭 처리 (실제 로그아웃 실행)
    const handleModalConfirm = () => {
        if (type === 'LOGOUT') {
            // 실제 로그아웃 처리
            clearUser();

            // 로그인 페이지로 이동 (또는 홈페이지로)
            navigate('/'); // 또는 navigate('/')
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

            {/* 로그아웃 모달 */}
            <Modal isOpen={isOpen} type={type} onClose={closeModal} onConfirm={handleModalConfirm} />
        </div>
    );
};

export default Mypage;
