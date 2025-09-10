import React, { useState, useEffect } from 'react';
import { selectRecentPostsTOP6 } from '../../services/supabasePosts';
import type { Tables } from '../../types/supabase';
const Sharing: React.FC = () => {
    const apiUrl: string = import.meta.env.VITE_API_BASE_URL;
    const [posts, setPosts] = useState<Tables<'posts'>[]>([]); // 배열 타입 추가
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await selectRecentPostsTOP6();
            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            setError('데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    // 로딩 상태 렌더링
    if (loading) {
        return (
            <div className='flex justify-center items-center p-8'>
                <div className='text-gray-500'>로딩 중...</div>
            </div>
        );
    }

    // 에러 상태 렌더링
    if (error) {
        return (
            <div className='p-4 bg-red-100 border border-red-300 text-red-700 rounded'>
                <p>{error}</p>
                <button onClick={fetchData} className='mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'>
                    다시 시도
                </button>
            </div>
        );
    }

    // 데이터 렌더링
    return (
        <div className='p-4'>
            <h2 className='text-2xl font-bold mb-6'>🏆 나눔 게시물 </h2>

            {posts.length > 0 ? (
                <div className='space-y-4'>
                    {posts.slice(0, 10).map((post, index) => (
                        <div
                            key={post.id}
                            className='flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow'
                        >
                            {/* 순위 */}
                            <div
                                className={`
                                flex items-center justify-center w-10 h-10 rounded-full mr-4 font-bold text-white
                                ${
                                    index === 0
                                        ? 'bg-yellow-500'
                                        : index === 1
                                          ? 'bg-gray-400'
                                          : index === 2
                                            ? 'bg-orange-400'
                                            : 'bg-blue-500'
                                }
                            `}
                            >
                                {index + 1}
                            </div>

                            {/* 게시물 정보 */}
                            <div className='flex-1'>
                                <h3 className='font-semibold text-lg mb-1'>{post.title}</h3>
                                <p className='text-gray-600 text-sm line-clamp-2'>{post.content}</p>
                                <div className='flex items-center mt-2 text-sm text-gray-500'>
                                    <img src={`${apiUrl}/${post.thumbnail_filename}`} />
                                    <span>
                                        작성일: {post.created_at ? new Date(post.created_at).toLocaleDateString() : '-'}
                                    </span>
                                </div>
                            </div>

                            {/* 좋아요 수 */}
                            <div className='flex items-center ml-4'>
                                <span className='text-red-500 mr-1'>❤️</span>
                                <span className='font-semibold text-lg'>
                                    {post.like_count ? post.like_count.toLocaleString() : '- '}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='text-center p-8 text-gray-500'>게시물이 없습니다.</div>
            )}
        </div>
    );
};

export default Sharing;
