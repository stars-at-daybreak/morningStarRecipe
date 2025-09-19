import React, { useState, useEffect } from 'react';
import { selectSharePostsTOP3 } from '../../services/supabasePosts';
import type { Tables } from '../../types/supabase';
import styles from './Share.module.css';
import PostItem from '../../components/postItem/PostItem.tsx';
import { Link } from 'react-router';
const Sharing: React.FC = () => {
    const [posts, setPosts] = useState<Tables<'posts'>[]>([]); // 배열 타입 추가
    const [error, setError] = useState<string | null>(null);
    const fetchData = async () => {
        try {
            setError(null);
            const data = await selectSharePostsTOP3();
            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            setError('데이터를 불러오는데 실패했습니다.');
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    // 데이터 렌더링
    return (
        <div className={styles.share}>
            <h2 className={styles.shareTitle}>모두의 나눔</h2>
            {posts.length > 0 ? (
                <div className={styles.shareList}>
                    {posts.map((post, index) => (
                        <Link to={'/share/' + post.id} key={index}>
                            <PostItem post={post} type='share' />
                        </Link>
                    ))}
                </div>
            ) : (
                <div className={styles.noPosts}>게시물이 없습니다.</div>
            )}
            <Link to='/share' className={styles.viewMoreButton}>
                더보기
            </Link>
        </div>
    );
};

export default Sharing;
