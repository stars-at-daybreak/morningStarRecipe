import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { usePageSetup } from '../../hooks/usePageSetup';
import { useModal } from '../../components/modal/ModalContext';
import useUserStore from '../../stores/useUserStore';
import { useFileUpload } from '../../hooks/useImageUpload';
import LevelBadge from '../../components/LevelBadge/LevelBadge';
import { saveProfileImage, getUserProfileImage, deleteProfileImage } from '../../services/supabaseFiles';
import styles from './mypage.module.css';

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
    const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 상태

    const nickname = user?.user_metadata.nickname;

    usePageSetup({
        title: '마이페이지',
        pageName: 'mypage',
        showBackButton: false,
    });

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

    // 에디터 버튼 클릭 시 드롭다운 토글
    const handleProfileEditClick = () => {
        if (isProcessing || isUploading) return;
        setShowDropdown(!showDropdown);
    };

    // 기본 이미지로 변경
    const handleSetDefaultImage = async () => {
        if (!user?.id) return;

        try {
            setIsProcessing(true);

            // 서버에서 프로필 이미지 삭제
            await deleteProfileImage(user.id);

            // 클라이언트 상태 업데이트
            setDisplayImageUrl(null);
            setShowDropdown(false);

            // console.log('기본 이미지로 변경됨');
        } catch (error) {
            console.error('기본 이미지 설정 중 오류:', error);
            alert('기본 이미지로 변경하는데 실패했습니다.');
        } finally {
            setIsProcessing(false);
        }
    };

    // 이미지 선택 버튼 클릭
    const handleSelectImage = () => {
        setIsProcessing(true);
        const handleFocus = () => {
            setTimeout(() => setIsProcessing(false), 100);
            window.removeEventListener('focus', handleFocus);
        };
        window.addEventListener('focus', handleFocus);
        fileInputRef.current?.click();
        setShowDropdown(false);
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
                const savedFileId = await saveProfileImage(filename);
                if (savedFileId) {
                    setDisplayImageUrl(`${apiUrl}/${filename}?t=${new Date().getTime()}`);
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
                            accept='image/png, image/jpeg, image/jpg'
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

                        {/* 드롭다운 메뉴 */}
                        {showDropdown && (
                            <div className={styles.page__profile_dropdown}>
                                <button
                                    className={styles.page__profile_dropdown_item}
                                    onClick={handleSetDefaultImage}
                                    disabled={isProcessing}
                                >
                                    기본이미지로 변경하기
                                </button>
                                <button className={styles.page__profile_dropdown_item} onClick={handleSelectImage}>
                                    프로필사진 변경하기
                                </button>
                            </div>
                        )}
                    </div>
                    <div className={styles.page__profile_nickname}>{nickname}</div>

                    <div className={styles.page__badge}>
                        <LevelBadge level={1} size='large' />
                    </div>
                </div>

                <div className={styles.page__menu}>
                    <Link to='/mypage/password-verification' className={styles.page__menu_item}>
                        회원정보 수정
                    </Link>
                    <Link to='/mypage/my-bookmark' className={styles.page__menu_item}>
                        내가 찜한 리스트
                    </Link>
                    <Link to='/mypage/my-postList' className={styles.page__menu_item}>
                        내가 올린 게시물 리스트
                    </Link>
                    <Link to='/mypage/levelup-guide' className={styles.page__menu_item}>
                        모두의 레벨업 가이드
                    </Link>
                    <Link to='/mypage/privacy' className={styles.page__menu_item}>
                        개인정보 처리방침
                    </Link>
                    <Link to='/mypage/terms' className={styles.page__menu_item}>
                        서비스 이용약관
                    </Link>
                    <div className={styles.page__actions}>
                        <button type='button'>
                            <Link to={'/mypage/delete-account'} className={styles.page__action_delete}>
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
