import { useEffect, useState } from 'react';
import {
    selectBookmarksByUserIdPostId,
    insertBookmarkRecord, // 북마크 추가 함수
    deleteBookmarkRecord, // 북마크 삭제 함수
} from '../services/supabasePostBookmark';

interface BookmarkProps {
    userId: string;
    postId: string;
}

export const Bookmark = ({ userId, postId }: BookmarkProps) => {
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const checkBookmarkStatus = async () => {
        const result = await selectBookmarksByUserIdPostId(postId, userId);
        return result; // 이미 boolean을 반환하므로 !!result 불필요
    };

    const toggleBookmark = async () => {
        if (loading) return; // 중복 클릭 방지

        try {
            setLoading(true);

            if (isBookmarked) {
                // 현재 상태를 기준으로 토글 (DB 재조회 없이)
                const result = await deleteBookmarkRecord(postId, userId);
                if (result) {
                    setIsBookmarked(false);
                }
            } else {
                const result = await insertBookmarkRecord(postId, userId);
                if (result) {
                    setIsBookmarked(true);
                }
            }
        } catch (error) {
            console.error('북마크 토글 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initBookmarkStatus = async () => {
            if (userId && postId) {
                const status = await checkBookmarkStatus();
                setIsBookmarked(status);
            }
        };

        initBookmarkStatus();
    }, [userId, postId]);

    return (
        <div>
            <button onClick={toggleBookmark} disabled={loading}>
                {loading ? '처리 중...' : isBookmarked ? '북마크 해제' : '북마크'}
            </button>
        </div>
    );
};
