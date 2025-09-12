// components/PostItem.tsx
import React, { useEffect, useState, useCallback } from 'react';
import styles from './PostItem.module.css';
import useUserStore from '../../stores/useUserStore.ts';
import { getUserVoteStatus } from '../../services/supabasePostVotes.ts';
import {
    selectBookmarksByUserIdPostId,
    insertBookmarkRecord,
    deleteBookmarkRecord,
} from '../../services/supabasePostBookmark';
import type { Tables } from '../../types/supabase';
import { useModal } from '../../hooks/useModal.tsx';
import Modal from '../modal/Modal.tsx';
import { useNavigate } from 'react-router-dom';

// 나눔 상태 타입 정의
type ShareStatus = 'available' | 'reserved' | 'completed' | 'cancelled';

// 레시피 타입 정의
interface PostItemProps {
    post: Tables<'posts'>;
    type: 'recipe' | 'share';
    onClick?: (postId: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, type, onClick }) => {
    const { user } = useUserStore(); // 로그인된 사용자 정보
    // 모달 상태 관리를 위한 useModal 훅
    const { isOpen, type: modalType, openModal, closeModal } = useModal();

    // 각 게시물의 사용자 상태
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 사용자 상태를 가져오는 함수
    const fetchUserStatus = useCallback(async () => {
        if (!user?.id) {
            // 로그인하지 않았으면 모든 상태를 false로 설정
            setIsLiked(false);
            setIsDisliked(false);
            setIsBookmarked(false);
            return;
        }

        try {
            // 추천&비추천 상태 확인
            const voteType = await getUserVoteStatus(post.id, user.id);
            setIsLiked(voteType === 'like');
            setIsDisliked(voteType === 'dislike');

            // 북마크 상태 확인 (레시피 타입일 때만)
            if (type === 'recipe') {
                const bookmarkStatus = await selectBookmarksByUserIdPostId(post.id, user.id);
                setIsBookmarked(bookmarkStatus);
            }
        } catch {
            // 에러 발생 시 모든 상태를 false로 설정
            setIsLiked(false);
            setIsDisliked(false);
            setIsBookmarked(false);
        }
    }, [user?.id, post.id, type]);

    // 북마크 토글 함수
    const handleBookmark = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user?.id) {
            openModal('LOGIN');
            return;
        }

        if (loading) return; // 중복 클릭 방지

        try {
            setLoading(true);

            if (isBookmarked) {
                const result = await deleteBookmarkRecord(post.id, user.id);
                if (result) {
                    setIsBookmarked(false);
                }
            } else {
                const result = await insertBookmarkRecord(post.id, user.id);
                if (result) {
                    setIsBookmarked(true);
                }
            }
        } catch {
            // 북마크 에러 무시 - 사용자가 다시 시도할 수 있음
        } finally {
            setLoading(false);
        }
    };

    // 모달 확인 버튼 클릭 처리 함수
    const handleModalConfirm = () => {
        if (modalType === 'LOGIN') {
            navigate('/login'); // 로그인 페이지로 이동
        }
        closeModal();
    };

    // 사용자나 게시물이 변경될 때마다 상태 업데이트
    useEffect(() => {
        fetchUserStatus();
    }, [fetchUserStatus]);

    // 레시피 게시물 레이아웃
    if (type === 'recipe') {
        return (
            <>
                <div className={styles.postItem} onClick={() => onClick && onClick(post.id)}>
                    {/* 썸네일 */}
                    <div className={styles.thumbnail}>
                        <img
                            src={
                                post.thumbnail_filename
                                    ? `https://dev.wenivops.co.kr/services/mandarin/${post.thumbnail_filename}`
                                    : 'https://dev.wenivops.co.kr/services/mandarin/1757564307890.jpg'
                            }
                            alt={post.title}
                            crossOrigin='anonymous'
                        />
                    </div>

                    <div className={styles.recipeContent}>
                        {/* 제목 */}
                        <div className={styles.title}>
                            <h3>{post.title}</h3>
                        </div>

                        <div className={styles.recipeActions}>
                            {/* 추천+비추천 (표시만, 클릭 불가) */}
                            <div className={styles.vote}>
                                {/* 추천 */}
                                <div className={styles.voteBtn}>
                                    <div
                                        className={`${styles.likeIcon} ${
                                            user?.id && isLiked ? styles.likeActive : styles.likeInactive
                                        }`}
                                        aria-label='추천'
                                    />
                                    <span className={user?.id && isLiked ? styles.activeText : styles.inactiveText}>
                                        {post.like_count || 0}
                                    </span>
                                </div>

                                {/* 비추천 */}
                                <div className={styles.voteBtn}>
                                    <div
                                        className={`${styles.dislikeIcon} ${
                                            user?.id && isDisliked ? styles.dislikeActive : styles.dislikeInactive
                                        }`}
                                        aria-label='비추천'
                                    />
                                    <span className={user?.id && isDisliked ? styles.activeText : styles.inactiveText}>
                                        {post.dislike_count || 0}
                                    </span>
                                </div>
                            </div>

                            {/* 북마크 */}
                            <button className={styles.bookmarkBtn} onClick={handleBookmark} disabled={loading}>
                                <div
                                    className={`${styles.bookmarkIcon} ${
                                        user?.id && isBookmarked ? styles.bookmarkActive : styles.bookmarkInactive
                                    }`}
                                    aria-label='북마크'
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <Modal isOpen={isOpen} type={modalType} onClose={closeModal} onConfirm={handleModalConfirm} />
            </>
        );
    }

    // 나눔 상태에 따른 스타일 클래스 반환 함수
    const getShareStatusClass = (status: ShareStatus): string => {
        switch (status) {
            case 'available':
                return styles.statusAvailable;
            case 'reserved':
                return styles.statusReserved;
            case 'completed':
                return styles.statusCompleted;
            case 'cancelled':
                return styles.statusCancelled;
            default:
                return styles.statusAvailable;
        }
    };

    // 나눔 상태에 따른 텍스트 반환 함수
    const getShareStatusText = (status: ShareStatus): string => {
        switch (status) {
            case 'available':
                return '나눔중';
            case 'reserved':
                return '예약중';
            case 'completed':
                return '나눔완료';
            case 'cancelled':
                return '취소됨';
            default:
                return '나눔중';
        }
    };

    // 나눔 게시물 레이아웃
    if (type === 'share') {
        return (
            <>
                <div className={styles.postItem} onClick={() => onClick && onClick(post.id)}>
                    {/* 썸네일 */}
                    <div className={styles.thumbnail}>
                        <img
                            src={
                                post.thumbnail_filename
                                    ? `https://dev.wenivops.co.kr/services/mandarin/${post.thumbnail_filename}`
                                    : 'https://dev.wenivops.co.kr/services/mandarin/1757564307890.jpg'
                            }
                            alt={post.title}
                            crossOrigin='anonymous'
                        />
                    </div>

                    <div className={styles.shareContent}>
                        {/* 제목 */}
                        <div className={styles.title}>
                            <h3>{post.title}</h3>
                        </div>

                        {/* 나눔 상태 버튼 */}
                        <div className={styles.shareActions}>
                            <div
                                className={`${styles.statusBtn} ${getShareStatusClass(post.share_status || 'available')}`}
                            >
                                <span>{getShareStatusText(post.share_status || 'available')}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={isOpen} type={modalType} onClose={closeModal} onConfirm={handleModalConfirm} />
            </>
        );
    }

    return null;
};

export default PostItem;
