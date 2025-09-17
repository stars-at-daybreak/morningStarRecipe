import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePageSetup } from '../../hooks/usePageSetup';
import { useModal } from '../../components/modal/ModalContext';
import useUserStore from '../../stores/useUserStore';
import { useFileUpload } from '../../hooks/useImageUpload';
import LevelBadge from '../../components/LevelBadge/LevelBadge';
import { saveProfileImage, getUserProfileImage } from '../../services/supabaseFiles';
import styles from './Mypage.module.css';

// API URL을 컴포넌트 외부 상수로 선언 (매번 재생성 방지)
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Mypage = () => {
    const { user } = useUserStore();
    const { openModal } = useModal();
    const navigate = useNavigate();

    const { uploadFile, isUploading, error, resetError } = useFileUpload();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [displayImageUrl, setDisplayImageUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [imageHasError, setImageHasError] = useState(false);

    const nickname = user?.user_metadata.nickname;

    // useMemo를 사용하여 config 객체가 최초 렌더링 시 한 번만 생성되도록 최적화
    const pageConfig = useMemo(
        () => ({
            title: '마이페이지',
            pageName: 'mypage',
            showBackButton: false,
        }),
        []
    );
    usePageSetup(pageConfig);

    // 로그인 상태 확인 및 비로그인 시 리디렉션
    useEffect(() => {
        if (!user) {
            openModal('LOGIN');
            navigate('/');
        }
    }, [user, openModal, navigate]);

    // DB에서 프로필 이미지 가져오기 (새로고침 대응)
    useEffect(() => {
        if (!user?.id) return;

        const fetchProfileImage = async () => {
            const imageData = await getUserProfileImage(user.id);
            if (imageData?.filename) {
                setDisplayImageUrl(`${apiUrl}/${imageData.filename}`);
            } else {
                setDisplayImageUrl(null);
            }
        };

        fetchProfileImage();
    }, [user?.id]);

    // 에러 발생 시 alert 창으로 사용자에게 알림
    useEffect(() => {
        if (error) {
            alert(error);
            resetError(); // 알림 후 에러 상태 초기화
        }
    }, [error, resetError]);

    // 표시할 이미지 URL이 변경될 때마다 에러 상태를 초기화
    useEffect(() => {
        setImageHasError(false);
    }, [displayImageUrl]);

    // 이미지 로드 실패 시 실행될 이벤트 핸들러
    const handleImageError = () => {
        setImageHasError(true);
    };

    // 수정 아이콘 클릭 핸들러
    const handleProfileEditClick = () => {
        if (isProcessing || isUploading) return;
        setIsProcessing(true);
        const handleFocus = () => {
            setTimeout(() => setIsProcessing(false), 100);
            window.removeEventListener('focus', handleFocus);
        };
        window.addEventListener('focus', handleFocus);
        fileInputRef.current?.click();
    };

    // 파일 선택 및 업로드 전체 프로세스 핸들러
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setIsProcessing(false);
            return;
        }
        if (!user?.id) {
            setIsProcessing(false);
            return;
        }

        resetError();

        try {
            const filename = await uploadFile(file);
            if (filename) {
                const savedFileId = await saveProfileImage(filename);
                if (savedFileId) {
                    setDisplayImageUrl(`${apiUrl}/${filename}`);
                }
            }
        } catch (err) {
            console.error('파일 처리 중 에러 발생:', err);
        } finally {
            setIsProcessing(false);
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    // 로그아웃 버튼 클릭 핸들러
    const handleLogoutClick = () => {
        openModal('LOGOUT');
    };

    return (
        <div className={styles.page}>
            <div className={styles.page__container}>
                <div className={styles.page__profile}>
                    <div className={styles.page__profile_wrap}>
                        <div className={styles.page__profile_image_container}>
                            {displayImageUrl ? (
                                imageHasError ? (
                                    <div className={styles.page__profile_fallback_icon} />
                                ) : (
                                    <img
                                        src={displayImageUrl}
                                        alt='프로필 이미지'
                                        className={styles.page__profile_image_tag}
                                        crossOrigin='anonymous'
                                        onError={handleImageError}
                                    />
                                )
                            ) : (
                                <div className={styles.page__profile_img} />
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type='file'
                            accept='image/*'
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            aria-label='프로필 이미지 파일 선택'
                        />
                        <div
                            className={`${styles.page__profile_edit} ${
                                isProcessing || isUploading ? styles.page__profile_edit_disabled : ''
                            }`}
                            onClick={handleProfileEditClick}
                            aria-disabled={isProcessing || isUploading}
                        />
                    </div>
                    <div className={styles.page__profile_nickname}>{nickname}님</div>

                    <div className={styles.page__badge}>
                        <LevelBadge level={1} size='large' />
                    </div>
                </div>

                <div className={styles.page__menu}>
                    <Link to='/mypage/edit' className={styles.page__menu_item}>
                        회원정보 수정
                    </Link>
                    <Link to='/mypage/bookmarks' className={styles.page__menu_item}>
                        내가 찜한 리스트
                    </Link>
                    <Link to='/mypage/my-posts' className={styles.page__menu_item}>
                        내가 올린 게시물 리스트
                    </Link>
                    <Link to='/guides' className={styles.page__menu_item}>
                        모두의 레벨업 가이드
                    </Link>
                    <Link to='/privacy' className={styles.page__menu_item}>
                        개인정보 처리방침
                    </Link>
                    <Link to='/terms' className={styles.page__menu_item}>
                        서비스 이용약관
                    </Link>
                    <div className={styles.page__actions}>
                        <button type='button'>
                            <Link to={'/DeleteAccount'} className={styles.page__action_delete}>
                                회원탈퇴
                            </Link>
                        </button>
                        <span></span>
                        <button type='button' onClick={handleLogoutClick} className={styles.page__action_logout}>
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mypage;
