import React, { useEffect, useState } from 'react';
import { updateUser } from '../../services/supabaseUsers.ts';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/useUserStore.ts';

const ProfileEditForm = () => {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        password: '',
        nickname: '',
        name: '',
        birthDate: '',
        gender: '',
        isForeigner: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const updateData = {
                ...(formData.password && { password: formData.password }),
                metadata: {
                    nickname: formData.nickname,
                    name: formData.name,
                    birthDate: formData.birthDate,
                    gender: formData.gender,
                    isForeigner: formData.isForeigner,
                },
            };

            const success = await updateUser(updateData);
            if (success) {
                navigate('/mypage');
            }
        } catch (error) {
            console.error('업데이트 오류:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.user_metadata) {
            setFormData({
                password: '',
                nickname: user.user_metadata.nickname || '',
                name: user.user_metadata.name || '',
                birthDate: user.user_metadata.birthDate || '',
                gender: user.user_metadata.gender || '',
                isForeigner: user.user_metadata.isForeigner || false,
            });
        }
    }, [user]);

    return (
        <div>
            <h2>회원정보 수정</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='email'>이메일 (변경불가):</label>
                    <input type='email' name='email' value={user?.email || ''} disabled />
                </div>

                <div>
                    <label htmlFor='password'>새 비밀번호 (변경하지 않으려면 비워두세요):</label>
                    <input
                        type='password'
                        name='password'
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder='새 비밀번호 (6자 이상)'
                    />
                </div>

                <div>
                    <label htmlFor='nickname'>닉네임:</label>
                    <input
                        type='text'
                        name='nickname'
                        value={formData.nickname}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor='name'>이름:</label>
                    <input type='text' name='name' value={formData.name} onChange={handleInputChange} required />
                </div>

                <div>
                    <label htmlFor='birthDate'>생년월일:</label>
                    <input
                        type='text'
                        name='birthDate'
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label>성별:</label>
                    <div>
                        <input
                            type='radio'
                            id='male'
                            name='gender'
                            value='M'
                            checked={formData.gender === 'M'}
                            onChange={handleInputChange}
                            required
                        />
                        <label htmlFor='male'>남성</label>

                        <input
                            type='radio'
                            id='female'
                            name='gender'
                            value='F'
                            checked={formData.gender === 'F'}
                            onChange={handleInputChange}
                            required
                        />
                        <label htmlFor='female'>여성</label>
                    </div>
                </div>

                <div>
                    <label>국적:</label>
                    <div>
                        <input
                            type='radio'
                            id='korean'
                            name='isForeigner'
                            value='false'
                            checked={!formData.isForeigner}
                            onChange={e =>
                                setFormData(prev => ({
                                    ...prev,
                                    isForeigner: e.target.value === 'true',
                                }))
                            }
                            required
                        />
                        <label htmlFor='korean'>내국인</label>

                        <input
                            type='radio'
                            id='foreigner'
                            name='isForeigner'
                            value='true'
                            checked={formData.isForeigner}
                            onChange={e =>
                                setFormData(prev => ({
                                    ...prev,
                                    isForeigner: e.target.value === 'true',
                                }))
                            }
                            required
                        />
                        <label htmlFor='foreigner'>외국인</label>
                    </div>
                </div>

                <div>
                    <button type='submit' disabled={isLoading}>
                        {isLoading ? '업데이트 중...' : '회원정보 수정'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEditForm;
