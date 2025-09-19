import React, { useState, useEffect, useCallback } from 'react';
import { createPost, updatePost } from '../../services/supabasePosts';
import useUserStore from '../../stores/useUserStore';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ShareForm.module.css';
import { usePageSetup } from '../../hooks/usePageSetup';
import { fetchPostWithUserNickname } from '../../services/supabasePosts';
import CustomSelect from '../../components/SelectBox/SelectBox';
import { ResponsiveFileUpload } from '../../components/ImgUpload/ImgUpload';
import { getPostThumbnails } from '../../services/supabaseFiles';
import delbtn from '../../assets/delete_btn_icon.svg';
import { saveThumbnailImage } from '../../services/supabaseFiles';
import LexicalEditor from '../../components/LexicalEditor/LexicalEditor';
import '../../components/LexicalEditor/LexicalEditor.css';
import { useModal } from '../../components/modal/ModalContext.ts';
import { setEditorInitialValue } from '../../utils/lexicalUtils';

// 유효성 검사 인터페이스
interface ValidationErrors {
    title?: string;
    pickup_location?: string;
    content?: string;
}

const ShareForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { openModal } = useModal();
    const { type, shareId } = location.state || { type: 'create' };

    const [formData, setFormData] = useState({
        post_type: 'share' as const,
        title: '',
        share_status: 'available' as 'available' | 'reserved' | 'completed' | 'cancelled',
        pickup_location: '',
        content: '',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useUserStore();
    const [thumbnailURL, setThumbnailURL] = useState('');

    // 유효성 검사 함수
    const validateForm = (): ValidationErrors => {
        const newErrors: ValidationErrors = {};

        // 제목 검사 (필수, 최소 2자)
        if (!formData.title.trim()) {
            newErrors.title = '제목을 입력해주세요.';
        } else if (formData.title.trim().length < 2) {
            newErrors.title = '제목은 최소 2자 이상 입력해주세요.';
        } else if (formData.title.trim().length > 100) {
            newErrors.title = '제목은 최대 100자까지 입력 가능합니다.';
        }

        // 나눔 위치 검사 (필수, 최소 2자)
        if (!formData.pickup_location.trim()) {
            newErrors.pickup_location = '나눔 위치를 입력해주세요.';
        } else if (formData.pickup_location.trim().length < 2) {
            newErrors.pickup_location = '나눔 위치는 최소 2자 이상 입력해주세요.';
        }

        // 내용 검사 (필수, 빈 에디터 상태가 아닌지 확인)
        if (!formData.content.trim()) {
            newErrors.content = '나눔 설명을 입력해주세요.';
        } else {
            try {
                const parsed = JSON.parse(formData.content);
                // 빈 에디터 상태인지 확인
                if (parsed.root && parsed.root.children) {
                    const hasContent = parsed.root.children.some((child: any) => {
                        if (child.children && child.children.length > 0) {
                            return child.children.some(
                                (textNode: any) => textNode.text && textNode.text.trim().length > 0
                            );
                        }
                        return false;
                    });

                    if (!hasContent) {
                        newErrors.content = '나눔 설명을 입력해주세요.';
                    }
                }
            } catch {
                // JSON이 아닌 일반 텍스트인 경우
                if (formData.content.trim().length < 5) {
                    newErrors.content = '나눔 설명을 최소 5자 이상 입력해주세요.';
                }
            }
        }

        return newErrors;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (type === 'create') {
                setIsLoading(false);
                return;
            }
            if (!shareId) {
                navigate('/');
                return;
            }

            try {
                const [detail, thumbnail] = await Promise.all([
                    fetchPostWithUserNickname(shareId),
                    getPostThumbnails(shareId),
                ]);

                if (detail) {
                    const safeContent = setEditorInitialValue(detail.content);

                    setFormData({
                        post_type: 'share' as const,
                        title: detail.title || '',
                        share_status: detail.share_status || 'available',
                        pickup_location: detail.pickup_location || '서울',
                        content: safeContent,
                    });

                    if (thumbnail?.file_type === 'thumbnail') {
                        setThumbnailURL(thumbnail.filename);
                    }
                }
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [type, shareId, navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?.id) {
            openModal('LOGIN');
            return;
        }

        // 유효성 검사 실행
        const validationErrors = validateForm();
        setErrors(validationErrors);

        // 에러가 있으면 제출 중단
        if (Object.keys(validationErrors).length > 0) {
            // 첫 번째 에러 필드로 스크롤
            const firstErrorField = Object.keys(validationErrors)[0];
            const errorElement = document.getElementById(firstErrorField);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                errorElement.focus();
            }
            return;
        }

        setIsSubmitting(true);

        try {
            const shareData = {
                ...formData,
                post_type: 'share' as const,
                user_id: user.id,
            };

            let isSuccess;
            if (type === 'create') {
                isSuccess = await createPost(shareData);
            } else if (type === 'update' && shareId) {
                isSuccess = await updatePost({ ...shareData, id: shareId });
            }

            if (isSuccess) {
                if (type === 'update' && shareId) {
                    await saveThumbnailImage(thumbnailURL, shareId);
                    openModal('SUCCESS', '/share/' + shareId, '나눔글 수정을 완료하였습니다.');
                } else if (type === 'create') {
                    await saveThumbnailImage(thumbnailURL, isSuccess.toString());
                    openModal('SUCCESS', '/share/' + isSuccess.toString(), '나눔글 작성을 완료하였습니다.');
                }
            } else {
                openModal('FAIL', undefined, '나눔글 처리를 실패했습니다.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            openModal('FAIL', undefined, '나눔글 처리 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = useCallback((filename: string | null) => {
        if (filename) {
            const newThumbnailURL = `${filename}`;
            setThumbnailURL(newThumbnailURL);
        }
    }, []);

    // 입력값 변경 시 해당 필드의 에러 제거
    const handleInputChange = (field: keyof ValidationErrors, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    usePageSetup({
        title: '모두의 나눔',
        pageName: type === 'create' ? 'shareWrite' : 'shareUpdate',
        showBackButton: true,
    });

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.shareForm}>
                <section>
                    <label htmlFor='title' className={styles.shareForm__title}>
                        제목: <span className={styles.required}></span>
                    </label>
                    <input
                        type='text'
                        id='title'
                        value={formData.title}
                        className={`${styles.shareForm__title_input} ${errors.title ? styles.error : ''}`}
                        onChange={e => handleInputChange('title', e.target.value)}
                        placeholder='제목을 입력하세요'
                        maxLength={100}
                    />
                    {errors.title && <div className={styles.error_message}>{errors.title}</div>}
                </section>

                <section className={styles.share_status_section}>
                    <label htmlFor='share_status' className={styles.share_status_label}>
                        나눔상태:
                    </label>
                    <div className={styles.share_status_select}>
                        <CustomSelect
                            value={formData.share_status}
                            onChange={e =>
                                setFormData(prev => ({
                                    ...prev,
                                    share_status: e.target.value as
                                        | 'available'
                                        | 'reserved'
                                        | 'completed'
                                        | 'cancelled',
                                }))
                            }
                            options={[
                                { value: 'available', label: '나눔중' },
                                { value: 'reserved', label: '예약중' },
                                { value: 'completed', label: '나눔완료' },
                                { value: 'cancelled', label: '나눔취소' },
                            ]}
                        />
                    </div>
                </section>

                <section>
                    <label htmlFor='pickup_location' className={styles.shareLocation__title}>
                        나눔 위치: <span className={styles.required}></span>
                    </label>
                    <input
                        type='text'
                        id='pickup_location'
                        placeholder='나눔할 장소를 입력하세요'
                        value={formData.pickup_location}
                        className={`${styles.shareLocation__title_input} ${errors.pickup_location ? styles.error : ''}`}
                        onChange={e => handleInputChange('pickup_location', e.target.value)}
                        maxLength={50}
                    />
                    {errors.pickup_location && <div className={styles.error_message}>{errors.pickup_location}</div>}
                </section>

                <div className={styles.content_section}>
                    <label className={styles.content_label}>
                        나눔 설명: <span className={styles.required}></span>
                    </label>
                    <div className={`${styles.editor_wrapper} ${errors.content ? styles.error : ''}`}>
                        {isLoading ? (
                            <div className={styles.loadingMessage}>로딩 중...</div>
                        ) : (
                            <LexicalEditor
                                placeholder='나눔할 물품에 대해 자세히 설명해주세요...'
                                className='post-editor'
                                initialValue={formData.content}
                                onChange={editorState => {
                                    handleInputChange('content', editorState);
                                }}
                            />
                        )}
                    </div>
                    {errors.content && <div className={styles.error_message}>{errors.content}</div>}
                </div>

                <div className={styles.thumbnail_container}>
                    <label htmlFor='share_thumbnail' className={styles.share_thumbnail_label}>
                        <strong>썸네일 등록</strong>(선택사항, 최대 1장)
                    </label>
                    <div className={styles.thumbnail_wrapper}>
                        <ResponsiveFileUpload postId={shareId} onFileUpload={handleFileUpload} />
                        {thumbnailURL && (
                            <div className={styles.thumbnail_preview}>
                                <button
                                    type='button'
                                    onClick={() => setThumbnailURL('')}
                                    className={styles.thumbnail_delete_button}
                                >
                                    <img src={delbtn} alt='삭제 버튼' className={styles.thumbnail_delete_img} />
                                </button>
                                <img
                                    src={import.meta.env.VITE_API_BASE_URL + '/' + thumbnailURL}
                                    alt='썸네일'
                                    className={styles.thumbnail_img}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <button type='submit' className={styles.shareForm__submit} disabled={isSubmitting}>
                    {isSubmitting ? '처리 중...' : (type !== 'update' ? '작성' : '수정') + ' 완료'}
                </button>
            </form>
        </div>
    );
};

export default ShareForm;
