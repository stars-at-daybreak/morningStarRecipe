import { useModal } from '../hooks/useModal';
import Modal from '../components/modal/Modal';

// 모달 테스트 페이지 컴포넌트
function ModalTestPage() {
    const modal = useModal();

    // 각 모달 열기 함수들
    const openLogoutModal = () => {
        modal.openModal('LOGOUT');
    };

    const openLoginModal = () => {
        modal.openModal('LOGIN');
    };

    const openDeleteAccountModal = () => {
        modal.openModal('DELETE_ACCOUNT');
    };

    const openConfirmDiscardPostModal = () => {
        modal.openModal('CONFIRM_DISCARD_POST');
    };

    const openPromptVerificationCodeModal = () => {
        modal.openModal('PROMPT_VERIFICATION_CODE');
    };

    const openNotifyAccountExistsModal = () => {
        modal.openModal('NOTIFY_ACCOUNT_EXISTS');
    };

    const openGuideEmailSentModal = () => {
        modal.openModal('GUIDE_EMAIL_SENT');
    };

    // 확인 버튼 클릭시 처리
    const handleConfirm = () => {
        // console.log(`${modal.type} 모달에서 확인 버튼 클릭!`);
        // 여기에 각 모달별 실제 처리 로직을 추가할 수 있어요
    };

    return (
        <div
            style={{
                padding: '40px',
                maxWidth: '800px',
                margin: '0 auto',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <h1
                style={{
                    textAlign: 'center',
                    marginBottom: '40px',
                    color: '#333',
                }}
            >
                🎯 모달 테스트 페이지
            </h1>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '40px',
                }}
            >
                {/* 로그아웃 모달 */}
                <button
                    onClick={openLogoutModal}
                    style={{
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        border: '2px solid #dee2e6',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#e9ecef';
                        e.currentTarget.style.borderColor = '#adb5bd';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#dee2e6';
                    }}
                >
                    🚪 로그아웃 모달
                </button>

                {/* 로그인 필요 모달 */}
                <button
                    onClick={openLoginModal}
                    style={{
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        border: '2px solid #dee2e6',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#e9ecef';
                        e.currentTarget.style.borderColor = '#adb5bd';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#dee2e6';
                    }}
                >
                    🔐 로그인 필요 모달
                </button>

                {/* 회원탈퇴 모달 */}
                <button
                    onClick={openDeleteAccountModal}
                    style={{
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        border: '2px solid #dee2e6',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#e9ecef';
                        e.currentTarget.style.borderColor = '#adb5bd';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#dee2e6';
                    }}
                >
                    ⚠️ 회원탈퇴 모달
                </button>

                {/* 게시물 뒤로가기 모달 */}
                <button
                    onClick={openConfirmDiscardPostModal}
                    style={{
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        border: '2px solid #dee2e6',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#e9ecef';
                        e.currentTarget.style.borderColor = '#adb5bd';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#dee2e6';
                    }}
                >
                    📝 게시물 나가기 모달
                </button>

                {/* 인증번호 입력 모달 */}
                <button
                    onClick={openPromptVerificationCodeModal}
                    style={{
                        padding: '16px',
                        backgroundColor: '#fff3cd',
                        border: '2px solid #ffeaa7',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#fff2a8';
                        e.currentTarget.style.borderColor = '#fdd835';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#fff3cd';
                        e.currentTarget.style.borderColor = '#ffeaa7';
                    }}
                >
                    🔢 인증번호 입력 모달
                    <div style={{ fontSize: '12px', color: '#856404', marginTop: '4px' }}>(특별한 UI)</div>
                </button>

                {/* 계정 존재 모달 */}
                <button
                    onClick={openNotifyAccountExistsModal}
                    style={{
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        border: '2px solid #dee2e6',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#e9ecef';
                        e.currentTarget.style.borderColor = '#adb5bd';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#dee2e6';
                    }}
                >
                    👤 계정 존재 모달
                </button>

                {/* 이메일 전송 모달 */}
                <button
                    onClick={openGuideEmailSentModal}
                    style={{
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        border: '2px solid #dee2e6',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#e9ecef';
                        e.currentTarget.style.borderColor = '#adb5bd';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#dee2e6';
                    }}
                >
                    📧 이메일 전송 모달
                </button>
            </div>

            {/* 현재 상태 표시 */}
            <div
                style={{
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6',
                }}
            >
                <h3 style={{ margin: '0 0 12px 0', color: '#495057' }}>📊 현재 모달 상태</h3>
                <p style={{ margin: '0', color: '#6c757d' }}>
                    <strong>열림 상태:</strong> {modal.isOpen ? '✅ 열림' : '❌ 닫힘'}
                </p>
                <p style={{ margin: '8px 0 0 0', color: '#6c757d' }}>
                    <strong>모달 타입:</strong> {modal.type || '없음'}
                </p>
            </div>

            {/* 실제 모달 컴포넌트 */}
            <Modal isOpen={modal.isOpen} type={modal.type} onClose={modal.closeModal} onConfirm={handleConfirm} />
        </div>
    );
}

export default ModalTestPage;
