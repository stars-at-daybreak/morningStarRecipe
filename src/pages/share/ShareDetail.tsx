import { useEffect, useState, useCallback } from 'react';
import { deletePost, fetchPostWithUserNickname } from '../../services/supabasePosts.ts';
import { useParams, useNavigate } from 'react-router-dom';
import PostComments from '../../components/post/PostComments.tsx';
import useUserStore from '../../stores/useUserStore.ts';
import type { PostWithUserNickname } from '../../types/posts.type.ts';
import styles from './ShareDetail.module.css';
import type { Tables } from '../../types/supabase.ts';
import noneProfile from '../../assets/none-profile.svg';
import LevelBadge from '../../components/LevelBadge/LevelBadge.tsx';
import { useModal } from '../../components/modal/ModalContext.ts';
import LexicalRenderer from '../../components/LexicalEditor/LexicalRenderer.tsx';
import { usePageSetup } from '../../hooks/usePageSetup';
export const ShareDetail = () => {
    const [writerProfileImage, setWriterProfileImage] = useState<Tables<'files'>>();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [share, setShare] = useState<PostWithUserNickname | null>(null);
    const { user } = useUserStore();
    const { openModal } = useModal();
    const handleUpdate = () => {
        if (id) {
            navigate('/share/form', {
                state: { type: 'update', shareId: id },
            });
        }
    };
    const handleDelete = async () => {
        if (id && user?.id) {
            openModal('DELETE', async () => {
                const isSuccess = await deletePost(id, user.id);
                if (isSuccess) {
                    navigate('/share');
                }
            });
        }
    };
    useEffect(() => {
        if (!id) return;
        const loadData = async () => {
            try {
                const detail = await fetchPostWithUserNickname(id);
                if (detail?.is_post_active === false || detail === null) {
                    navigate('/share');
                }
                setShare(detail);
            } catch (error) {
                console.error('Failed to fetch post:', error);
            }
        };
        loadData();
    }, [id]); // id만 의존성으로!
    usePageSetup({
        title: '모두의 나눔',
        pageName: 'shareDetail',
        showBackButton: true,
    });
    type StatusType = 'available' | 'reserved' | 'completed' | 'cancelled' | null | undefined;
    const markToStatus = (status: StatusType): string => {
        const statusMap: Record<'available' | 'reserved' | 'completed' | 'cancelled', string> = {
            available: '나눔중',
            reserved: '예약중',
            completed: '나눔완료',
            cancelled: '나눔취소',
        };

        if (!status) return '알 수 없음'; // null, undefined 처리
        return statusMap[status] || '알 수 없음';
    };
    return (
        <div className={styles['share']}>
            <section className={styles['share__writer']}>
                <h2 className='sr-only'>작성자 프로필</h2>

                <div className={styles['profile-img-box']}>
                    {writerProfileImage ? (
                        <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/${writerProfileImage.filename}`}
                            alt='작성자 프로필 이미지'
                        />
                    ) : (
                        <img src={noneProfile} alt='작성자 프로필 이미지' />
                    )}
                </div>

                <span className={styles['share__writer-nickname']}>{share?.user_nickname}</span>
                <div className={styles['share__writer-badge']}>
                    <LevelBadge level={share?.current_level || 1} size='large' />
                </div>
                {user?.id === share?.user_id && (
                    <div className={styles['share__writer-btn']}>
                        <button onClick={handleUpdate}>수정</button>
                        <button onClick={handleDelete}>삭제</button>
                    </div>
                )}
            </section>
            <section className={styles['share__title']}>
                <h2>{share?.title}</h2>
            </section>
            <section className={styles['share__location']}>
                <p>
                    <span className={styles['share__location_tittle']}>나눔 위치:</span>
                    {share?.pickup_location}
                </p>
            </section>
            <section className={styles['share__content']}>
                <LexicalRenderer content={share?.content || ''} className={styles['share-content-renderer']} />
                <div className={styles['share__content_inf']}>
                    <span className={`${styles['share__status']} ${styles[share?.share_status ?? 'default']}`}>
                        {markToStatus(share?.share_status)}
                    </span>
                    <div className={styles['share__date']}>
                        <span>작성 일자 : </span>
                        {share?.created_at ? share.created_at.split('T')[0].replace(/-/g, '.') : ''}
                    </div>
                </div>
            </section>
            <section className={styles['share__comments']}>{id && <PostComments postId={id} />}</section>
        </div>
    );
};
