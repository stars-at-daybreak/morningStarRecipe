import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePageSetup } from '../../hooks/usePageSetup';
import { useModal } from '../../components/modal/ModalContext';
import useUserStore from '../../stores/useUserStore';
import { useFileUpload } from '../../hooks/useImageUpload';
import LevelBadge from '../../components/LevelBadge/LevelBadge';
import { saveProfileImage, getUserProfileImage } from '../../services/supabaseFiles';
import styles from './Mypage.module.css';

// API URL을 컴포넌트 외부 상수로 선언
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

    const pageConfig = useMemo(
        () => ({
            title: '마이페이지',
            pageName: 'mypage',
            showBackButton: false,
        }),
        []
    );
    usePageSetup(pageConfig);

    useEffect(() => {
        if (!user) {
            openModal('LOGIN');
            navigate('/');
        }
    }, [user, openModal, navigate]);

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

    useEffect(() => {
        if (error) {
            alert(error);
            resetError();
        }
    }, [error, resetError]);

    useEffect(() => {
        setImageHasError(false);
    }, [displayImageUrl]);

    const handleImageError = () => {
        setImageHasError(true);
    };

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

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user?.id) {
            setIsProcessing(false);
            return;
        }

        resetError();

        try {
            const filename = await uploadFile(file);
            if (filename) {
                // supabaseFiles.ts의 saveProfileImage를 호출합니다.
                const savedFileId = await saveProfileImage(filename);
                if (savedFileId) {
                    // 성공 시 화면에 즉시 반영
                    setDisplayImageUrl(`${apiUrl}/${filename}?t=${new Date().getTime()}`); // 캐시 방지용 타임스탬프 추가
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
                    <div className={styles.page__profile_nickname}>{nickname}</div>
                    <div className={styles.page__badge}>
                        <LevelBadge level={1} size='large' />
                    </div>
                </div>
                <div className={styles.page__menu}>
                    <Link to='/mypage/user-edit' className={styles.page__menu_item}>
                        회원정보 수정
                    </Link>
                    <Link to='/mypage/my-bookmark' className={styles.page__menu_item}>
                        내가 찜한 리스트
                    </Link>
                    <Link to='/mypage/my-postList' className={styles.page__menu_item}>
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
                            <Link to={'/delete-account'} className={styles.page__action_delete}>
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
