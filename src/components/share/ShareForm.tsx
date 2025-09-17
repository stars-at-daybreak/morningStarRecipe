import React, { useState, useEffect, useCallback } from 'react';
import { createPost, updatePost } from '../../services/supabasePosts.ts';
import useUserStore from '../../stores/useUserStore.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ShareForm.module.css';
import { usePageSetup } from '../../hooks/usePageSetup';
import { fetchPostWithUserNickname } from '../../services/supabasePosts.ts';
import CustomSelect from '../SelectBox/SelectBox.tsx';
import { ResponsiveFileUpload } from '../ImgUpload/ImgUpload';
import { getPostThumbnails } from '../../services/supabaseFiles';
import delbtn from '../../assets/delete_btn_icon.svg';
import { saveThumbnailImage } from '../../services/supabaseFiles';
const ShareForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { type, shareId } = location.state || { type: 'create' };
    const [formData, setFormData] = useState({
        post_type: 'share' as const,
        title: '',
        share_status: 'available' as 'available' | 'reserved' | 'completed' | 'cancelled',
        pickup_location: '서울',
        content: '',
    });
    const { user } = useUserStore();
    const [thumbnailURL, setThumbnailURL] = useState('');

    // 📍 수정: useEffect로 간단하게 처리
    useEffect(() => {
        const fetchData = async () => {
            if (type !== 'update' || !shareId) return;

            try {
                // Promise.all로 병렬 처리
                const [detail, thumbnail] = await Promise.all([
                    fetchPostWithUserNickname(shareId),
                    getPostThumbnails(shareId),
                ]);

                if (detail) {
                    if (detail.post_type !== 'share') {
                        alert('잘못된 게시글 타입입니다.');
                        navigate('/share');
                        return;
                    }

                    // 상태 업데이트를 한 번에 처리
                    setFormData({
                        post_type: 'share' as const,
                        title: detail.title || '',
                        share_status: detail.share_status || 'available',
                        pickup_location: detail.pickup_location || '서울',
                        content: detail.content || '',
                    });

                    if (thumbnail?.file_type === 'thumbnail') {
                        setThumbnailURL(`${thumbnail.filename}`);
                    }
                }
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
                alert('데이터를 불러오는데 실패했습니다.');
            }
        };

        fetchData();
    }, [type, shareId, navigate]); // isLoading 제거!

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user?.id) {
            alert('로그인이 필요합니다.');
            return;
        }
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
            alert('레시피 저장을 완료하였습니다.');
            if (type === 'update' && shareId) {
                await saveThumbnailImage(thumbnailURL, shareId);
            } else if (type === 'create') {
                await saveThumbnailImage(thumbnailURL, isSuccess.toString());
            }
        }
    };

    const handleFileUpload = useCallback((filename: string | null) => {
        if (filename) {
            const newThumbnailURL = `${filename}`;
            setThumbnailURL(newThumbnailURL);
        }
    }, []);

    usePageSetup({
        title: type === 'create' ? '나눔글 작성' : '나눔글 수정',
        pageName: type === 'create' ? 'shareWrite' : 'shareUpdate',
        showBackButton: true,
    });

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.shareForm}>
                <section>
                    <label htmlFor='title' className={styles.shareForm__title}>
                        제목:
                    </label>
                    <input
                        type='text'
                        id='title'
                        value={formData.title}
                        className={styles.shareForm__title_input}
                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                </section>
                <section className={styles.share_status_section}>
                    <label htmlFor='share_status' className={styles.share_status_label}>
                        나눔상태 :
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
                        나눔 위치 :
                    </label>
                    <input
                        type='text'
                        id='pickup_location'
                        placeholder='나눔할 장소를 입력하세요'
                        value={formData.pickup_location}
                        className={styles.shareLocation__title_input}
                        onChange={e => setFormData(prev => ({ ...prev, pickup_location: e.target.value }))}
                    />
                </section>
                <div>
                    <textarea
                        name='content'
                        id='content'
                        value={formData.content}
                        onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    ></textarea>
                </div>
                <div className={styles.thumbnail_container}>
                    <label htmlFor='share_thumbnail' className={styles.share_thumbnail_label}>
                        <strong>썸네일 등록</strong>(최대 1장)
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
                <button type='submit' className={styles.shareForm__submit}>
                    {type !== 'update' ? '작성' : '수정'} 완료
                </button>
            </form>
        </div>
    );
};

export default ShareForm;
