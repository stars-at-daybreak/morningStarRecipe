import type { ModalType } from '../../hooks/useModal';
import VerifyCodeContent from './VerifyCodeContent';

// 각 모달 타입별 정보를 정의하는 함수
const getModalContent = (type: ModalType) => {
    switch (type) {
        case 'LOGOUT':
            return {
                title: '로그아웃 하시겠습니까?',
                message: '',
                hasCancel: true,
                confirmText: '확인',
                cancelText: '취소',
            };

        case 'LOGIN':
            return {
                title: '로그인 필요',
                message: '로그인이 필요한 서비스입니다.\n로그인을 하시겠습니까?',
                hasCancel: true,
                confirmText: '확인',
                cancelText: '취소',
            };

        case 'DELETE_ACCOUNT':
            return {
                title: '회원탈퇴를 하시겠습니까?',
                message: '',
                hasCancel: true,
                confirmText: '확인',
                cancelText: '취소',
            };

        case 'CONFIRM_DISCARD_POST':
            return {
                title: '앗! 거의 다 됐는데!',
                message: '나눔글을 저장하지 않고 나가시면,\n작성하신 내용이 모두 사라져요!',
                hasCancel: true,
                confirmText: '계속 작성하기',
                cancelText: '나가기',
            };

        case 'PROMPT_VERIFICATION_CODE':
            return {
                title: '인증번호를 입력해주세요',
                message: '',
                renderContent: () => <VerifyCodeContent />,
                hasCancel: false,
                confirmText: '확인',
                cancelText: '',
                isVerifyModal: true,
            };

        case 'NOTIFY_ACCOUNT_EXISTS':
            return {
                title: '이미 존재하는 계정입니다.',
                message: '',
                hasCancel: false,
                confirmText: '확인',
                cancelText: '',
            };

        case 'GUIDE_EMAIL_SENT':
            return {
                title: '이 이메일 주소로 너무 많은\n이메일이 전송되었습니다.\n잠시 후 다시 시도해 주세요.',
                message: '',
                hasCancel: false,
                confirmText: '확인',
                cancelText: '',
            };

        default:
            return {
                title: '',
                message: '',
                hasCancel: false,
                confirmText: '확인',
                cancelText: '취소',
            };
    }
};

export default getModalContent;
