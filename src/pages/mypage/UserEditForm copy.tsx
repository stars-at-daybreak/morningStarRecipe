import React, { useEffect, useState } from 'react';
import { updateUser } from '../../services/supabaseUsers';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/useUserStore';
import styles from './userEditForm.module.css';

interface FormData {
    password: string;
    nickname: string;
    name: string;
    birthDate: string;
    gender: string;
    isForeigner: boolean;
}

const UserEditForm = () => {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<FormData>({
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

    const handleIsForeignerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            isForeigner: e.target.value === 'true',
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
        <div className={styles['user-edit']}>
            <h2 className={styles['user-edit__title']}>회원정보 수정</h2>
            <form onSubmit={handleSubmit} className={styles['user-edit__form']}>
                <div className={styles['user-edit__field']}>
                    <label htmlFor='email' className={styles['user-edit__label']}>
                        이메일 (변경불가):
                    </label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        value={user?.email || ''}
                        disabled
                        className={`${styles['user-edit__input']} ${styles['user-edit__input--disabled']}`}
                    />
                </div>

                <div className={styles['user-edit__field']}>
                    <label htmlFor='password' className={styles['user-edit__label']}>
                        새 비밀번호 (변경하지 않으려면 비워두세요):
                    </label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder='새 비밀번호 (6자 이상)'
                        className={styles['user-edit__input']}
                    />
                </div>

                <div className={styles['user-edit__field']}>
                    <label htmlFor='nickname' className={styles['user-edit__label']}>
                        닉네임:
                    </label>
                    <input
                        type='text'
                        id='nickname'
                        name='nickname'
                        value={formData.nickname}
                        onChange={handleInputChange}
                        required
                        className={styles['user-edit__input']}
                    />
                </div>

                <div className={styles['user-edit__field']}>
                    <label htmlFor='name' className={styles['user-edit__label']}>
                        이름:
                    </label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={styles['user-edit__input']}
                    />
                </div>

                <div className={styles['user-edit__field']}>
                    <label htmlFor='birthDate' className={styles['user-edit__label']}>
                        생년월일:
                    </label>
                    <input
                        type='text'
                        id='birthDate'
                        name='birthDate'
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        required
                        className={styles['user-edit__input']}
                    />
                </div>

                <div className={styles['user-edit__field']}>
                    <label className={styles['user-edit__label']}>성별:</label>
                    <div className={styles['user-edit__radio-group']}>
                        <div className={styles['user-edit__radio-item']}>
                            <input
                                type='radio'
                                id='male'
                                name='gender'
                                value='M'
                                checked={formData.gender === 'M'}
                                onChange={handleInputChange}
                                required
                                className={styles['user-edit__radio']}
                            />
                            <label htmlFor='male' className={styles['user-edit__radio-label']}>
                                남성
                            </label>
                        </div>

                        <div className={styles['user-edit__radio-item']}>
                            <input
                                type='radio'
                                id='female'
                                name='gender'
                                value='F'
                                checked={formData.gender === 'F'}
                                onChange={handleInputChange}
                                required
                                className={styles['user-edit__radio']}
                            />
                            <label htmlFor='female' className={styles['user-edit__radio-label']}>
                                여성
                            </label>
                        </div>
                    </div>
                </div>

                <div className={styles['user-edit__field']}>
                    <label className={styles['user-edit__label']}>국적:</label>
                    <div className={styles['user-edit__radio-group']}>
                        <div className={styles['user-edit__radio-item']}>
                            <input
                                type='radio'
                                id='korean'
                                name='isForeigner'
                                value='false'
                                checked={!formData.isForeigner}
                                onChange={handleIsForeignerChange}
                                required
                                className={styles['user-edit__radio']}
                            />
                            <label htmlFor='korean' className={styles['user-edit__radio-label']}>
                                내국인
                            </label>
                        </div>

                        <div className={styles['user-edit__radio-item']}>
                            <input
                                type='radio'
                                id='foreigner'
                                name='isForeigner'
                                value='true'
                                checked={formData.isForeigner}
                                onChange={handleIsForeignerChange}
                                required
                                className={styles['user-edit__radio']}
                            />
                            <label htmlFor='foreigner' className={styles['user-edit__radio-label']}>
                                외국인
                            </label>
                        </div>
                    </div>
                </div>

                <div className={styles['user-edit__submit-container']}>
                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`${styles['user-edit__submit-button']} ${isLoading ? styles['user-edit__submit-button--loading'] : ''}`}
                    >
                        {isLoading ? '업데이트 중...' : '회원정보 수정'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserEditForm;
