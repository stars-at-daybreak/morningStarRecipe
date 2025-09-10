import React, { useState } from 'react';
import { createPost, updatePost } from '../services/supabasePosts.ts';
import useUserStore from '../stores/useUserStore.ts';
import { useLocation } from 'react-router-dom';

const ShareForm = () => {
    const location = useLocation();
    const { type, shareId } = location.state || { type: 'create' };
    const [formData, setFormData] = useState({
        post_type: 'share' as const,
        title: '',
        content: '',
        share_status: 'available' as 'available' | 'reserved' | 'completed' | 'cancelled',
        pickup_location: '서울',
        thumbnail_filename: 'test.png',
    });
    const { user } = useUserStore();

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
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='title'>제목:</label>
                    <input
                        type='text'
                        id='title'
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor='share_status'>나눔 상태:</label>
                    <select
                        name='share_status'
                        id='share_status'
                        value={formData.share_status}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                share_status: e.target.value as 'available' | 'reserved' | 'completed' | 'cancelled',
                            })
                        }
                    >
                        <option value='available'>나눔중</option>
                        <option value='reserved'>취소</option>
                        <option value='cancelled'>다내꺼</option>
                        <option value='completed'>다내꺼</option>
                    </select>
                </div>
                <div>
                    <textarea
                        name='content'
                        id='content'
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                    ></textarea>
                </div>

                <button type='submit'>작성 완료</button>
            </form>
        </div>
    );
};

export default ShareForm;
