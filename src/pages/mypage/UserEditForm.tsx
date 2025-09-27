import React, { useEffect, useState } from 'react';
import { updateUser } from '../../services/supabaseUsers';
import useUserStore from '../../stores/useUserStore';
import { usePageSetup } from '../../hooks/usePageSetup';
import InputText from '../../components/input/InputText';
import InputRadio from '../../components/input/InputRadio';
import Button from '../../components/button/Button';
import NicknameButton from '../../components/button/NicknameButton';
import ResponsiveLogo from '../../components/logo/ResponsiveLogo';
import { useModal } from '../../components/modal/ModalContext';
import styles from './userEditForm.module.css';
interface FormData {
    password: string;
    password2: string;
    nickname: string;
    name: string;
    birthDate: string;
    gender: string;
    isForeigner: boolean;
}

interface FormErrors {
    nickname: string;
    password: string;
}

const UserEditForm: React.FC = () => {
    const { user } = useUserStore();
    const { openModal } = useModal();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormData>({
        password: '',
        password2: '',
        nickname: '',
        name: '',
        birthDate: '',
        gender: '',
        isForeigner: false,
    });

    const [originalNickname, setOriginalNickname] = useState<string>('');
    const [nicknameValidated, setNicknameValidated] = useState<boolean>(true);
    const [nicknameCheckMessage, setNicknameCheckMessage] = useState<string>('');
    const [isNicknameCheckSuccess, setIsNicknameCheckSuccess] = useState<boolean | null>(null);
    const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
    const [passwordValid, setPasswordValid] = useState<boolean>(true);

    const [formErrors, setFormErrors] = useState<FormErrors>({
        nickname: '',
        password: '',
    });

    const validatePassword = (password: string): boolean => {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isValidLength = password.length >= 8 && password.length <= 15;

        return hasLetter && hasNumber && hasSpecialChar && isValidLength;
    };

    const setError = (field: keyof FormErrors, message: string) => {
        setFormErrors(prev => ({
            ...prev,
            [field]: message,
        }));
    };

    const clearError = (field: keyof FormErrors) => {
        setFormErrors(prev => ({
            ...prev,
            [field]: '',
        }));
    };

    const isFormValid = (): boolean => {
        const nicknameChanged = formData.nickname !== originalNickname;
        const passwordChanged = formData.password.length > 0;

        if (!nicknameChanged && !passwordChanged) {
            return false;
        }

        if (nicknameChanged) {
            if (!formData.nickname.trim()) return false;
            if (!nicknameValidated) return false;
            // 닉네임 검증 메시지가 성공인지 확인
            if (isNicknameCheckSuccess !== true) return false;
        }

        if (passwordChanged) {
            if (!passwordValid || !passwordMatch) return false;
        }

        return true;
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type, checked } = e.target;

        if (name === 'nickname') {
            clearError('nickname');
        } else if (name === 'password' || name === 'password2') {
            clearError('password');
        }

        if (name === 'nickname') {
            if (value !== originalNickname) {
                setNicknameValidated(false);
                setNicknameCheckMessage('');
                setIsNicknameCheckSuccess(null);
            } else {
                setNicknameValidated(true);
                setNicknameCheckMessage('');
                setIsNicknameCheckSuccess(null);
            }
        }

        if (name === 'password') {
            if (value.length > 0) {
                const isValid = validatePassword(value);
                setPasswordValid(isValid);
                if (!isValid) {
                    setError('password', '영문, 숫자, 특수문자 포함 8-15자로 입력해주세요.');
                }
            } else {
                setPasswordValid(true);
                clearError('password');
            }
        }

        if (name === 'password' || name === 'password2') {
            const newFormData = {
                ...formData,
                [name]: value,
            };

            if (newFormData.password && newFormData.password2) {
                const isMatch = newFormData.password === newFormData.password2;
                setPasswordMatch(isMatch);
                if (!isMatch) {
                    setError('password', '비밀번호가 일치하지 않습니다.');
                } else if (passwordValid) {
                    clearError('password');
                }
            } else {
                setPasswordMatch(true);
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        let hasErrors = false;

        if (!formData.nickname.trim()) {
            setError('nickname', '닉네임을 입력해주세요.');
            hasErrors = true;
        } else if (formData.nickname !== originalNickname && !nicknameValidated) {
            setError('nickname', '닉네임 중복 확인을 완료해주세요.');
            hasErrors = true;
        } else if (formData.nickname !== originalNickname && isNicknameCheckSuccess !== true) {
            setError('nickname', '이미 존재하는 닉네임입니다.');
            hasErrors = true;
        }

        if (formData.password && !passwordValid) {
            setError('password', '영문, 숫자, 특수문자 포함 8-15자로 입력해주세요.');
            hasErrors = true;
        }

        if (formData.password && !passwordMatch) {
            setError('password', '새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            hasErrors = true;
        }

        if (hasErrors) {
            return;
        }

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

            const result = await updateUser(updateData);

            setIsLoading(false);

            if (!result) {
                openModal('FAIL', undefined, '이전 비밀번호와 동일합니다.');
                return;
            } else {
                openModal('SUCCESS', '/mypage', '회원정보가 수정되었습니다.');
                return;
            }
        } catch (error: unknown) {
            setIsLoading(false);
            console.error('업데이트 오류:', error);

            // 에러 메시지 안전하게 추출
            let errorMessage = '';
            if (error instanceof Error) {
                errorMessage = error.message;
                console.log('Error message:', errorMessage);
            } else if (typeof error === 'string') {
                errorMessage = error;
                console.log('String error:', errorMessage);
            }

            // 기존 비밀번호와 동일한 경우를 catch에서 처리
            if (
                errorMessage.includes('New password should be different') ||
                errorMessage.includes('same') ||
                errorMessage.includes('동일') ||
                errorMessage.includes('identical') ||
                errorMessage.includes('duplicate')
            ) {
                openModal('FAIL', undefined, '이전 비밀번호와 동일합니다.');
            } else {
                openModal('FAIL', undefined, '회원정보 수정 중 오류가 발생했습니다.');
            }
        }
    };

    usePageSetup({
        title: '마이페이지',
        pageName: 'user-edit',
        showBackButton: true,
    });

    useEffect(() => {
        if (user && user.user_metadata) {
            const userNickname = user.user_metadata.nickname || '';
            setOriginalNickname(userNickname);
            setFormData({
                password: '',
                password2: '',
                nickname: userNickname,
                name: user.user_metadata.name || '',
                birthDate: user.user_metadata.birthDate || '',
                gender: user.user_metadata.gender || '',
                isForeigner: user.user_metadata.isForeigner || false,
            });
        }
    }, [user]);

    return (
        <>
            <title>회원정보 수정 - 모두의 부엌</title>
            <meta name='description' content='회원정보를 수정하세요.' />
            <meta name='robots' content='noindex, nofollow' />
            <link rel='canonical' href='https://morningstarrecipe.netlify.app/mypage/user-edit' />

            <section className={styles['user-edit']}>
                <div className={styles['user-edit__container']}>
                    <div className={styles['user-edit__header']}>
                        <h2 className='sr-only'>회원정보 수정</h2>
                        <ResponsiveLogo />
                    </div>

                    <form onSubmit={handleSubmit} className={styles['user-edit__form']}>
                        <div className={styles['user-edit__info-group']}>
                            <div className={styles['user-edit__info']}>
                                <InputText
                                    label='이메일'
                                    id='email'
                                    name='email'
                                    state={user?.email || ''}
                                    type='email'
                                    handleInput={() => {}}
                                    placeholder=''
                                    isDisabled={true}
                                />
                                <div className={styles['user-edit__nickname-group']}>
                                    <InputText
                                        label='닉네임'
                                        id='nickname'
                                        name='nickname'
                                        state={formData.nickname}
                                        type='text'
                                        handleInput={handleInput}
                                        placeholder='닉네임을 입력해주세요'
                                        isRequired={true}
                                    />
                                    <NicknameButton
                                        nickname={formData.nickname}
                                        handleDuplicate={(isDuplicated: boolean | null) => {
                                            if (isDuplicated === false) {
                                                setNicknameValidated(true);
                                                setNicknameCheckMessage('사용 가능한 닉네임입니다.');
                                                setIsNicknameCheckSuccess(true);
                                                clearError('nickname');
                                            } else if (isDuplicated === true) {
                                                setNicknameValidated(false);
                                                setNicknameCheckMessage('이미 존재하는 닉네임입니다.');
                                                setIsNicknameCheckSuccess(false);
                                            } else {
                                                setNicknameValidated(false);
                                                setNicknameCheckMessage('닉네임 확인 중 오류가 발생했습니다.');
                                                setIsNicknameCheckSuccess(false);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={styles['user-edit__validation-text-error-wrap']}>
                                {formErrors.nickname && (
                                    <p
                                        className={`${styles['user-edit__validation-text']} ${styles['user-edit__validation-text--error']}`}
                                    >
                                        {formErrors.nickname}
                                    </p>
                                )}

                                {nicknameCheckMessage && !formErrors.nickname && (
                                    <p
                                        className={`${styles['user-edit__validation-text']} ${
                                            isNicknameCheckSuccess
                                                ? styles['user-edit__validation-text--success']
                                                : styles['user-edit__validation-text--error']
                                        }`}
                                    >
                                        {nicknameCheckMessage}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={styles['user-edit__info-group']}>
                            <div className={styles['user-edit__info']}>
                                <InputText
                                    label='새 비밀번호'
                                    id='password'
                                    name='password'
                                    state={formData.password}
                                    type='password'
                                    handleInput={handleInput}
                                    placeholder='영문, 숫자, 특수문자 포함 8-15자로 입력해주세요.'
                                />
                                <InputText
                                    label='새 비밀번호 확인'
                                    id='password2'
                                    name='password2'
                                    state={formData.password2}
                                    type='password'
                                    handleInput={handleInput}
                                    placeholder='확인을 위해 비밀번호를 한 번 더 입력해주세요.'
                                />
                            </div>
                            <div className={styles['user-edit__validation-text-error-wrap']}>
                                {formErrors.password && (
                                    <p
                                        className={`${styles['user-edit__validation-text']} ${styles['user-edit__validation-text--error']}`}
                                    >
                                        {formErrors.password}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={styles['user-edit__info_user']}>
                            <InputText
                                label='이름'
                                id='name'
                                name='name'
                                state={formData.name}
                                type='text'
                                handleInput={() => {}}
                                placeholder=''
                                isDisabled={true}
                            />
                            <InputText
                                label='생년월일'
                                id='birthDate'
                                name='birthDate'
                                state={
                                    formData.birthDate
                                        ? (formData.birthDate.charAt(0) <= '2' ? '20' : '19') +
                                          formData.birthDate.slice(0, 2) +
                                          '.' +
                                          formData.birthDate.slice(2, 4) +
                                          '.' +
                                          formData.birthDate.slice(4, 6)
                                        : ''
                                }
                                type='text'
                                handleInput={() => {}}
                                placeholder=''
                                isDisabled={true}
                            />
                        </div>

                        <div className={styles['user-edit__radio-group']}>
                            <div className={styles['user-edit__radio-info-group']}>
                                <label className={styles['user-edit__label']}>성별</label>
                                <div className={styles['user-edit__radio']}>
                                    <InputRadio
                                        label='남성'
                                        id='male'
                                        name='gender'
                                        value='M'
                                        checked={formData.gender === 'M'}
                                        isDisabled={true}
                                        handleInput={() => {}} // 비활성화 상태이므로 빈 함수 전달
                                    />
                                    <InputRadio
                                        label='여성'
                                        id='female'
                                        name='gender'
                                        value='F'
                                        checked={formData.gender === 'F'}
                                        isDisabled={true}
                                        handleInput={() => {}} // 비활성화 상태이므로 빈 함수 전달
                                    />
                                </div>
                            </div>

                            <div className={styles['user-edit__radio-info-group']}>
                                <label className={styles['user-edit__label']}>내외국인</label>
                                <div className={styles['user-edit__radio']}>
                                    <InputRadio
                                        label='내국인'
                                        id='korean'
                                        name='isForeigner'
                                        value='false'
                                        checked={!formData.isForeigner}
                                        isDisabled={true}
                                        handleInput={() => {}}
                                    />
                                    <InputRadio
                                        label='외국인'
                                        id='foreigner'
                                        name='isForeigner'
                                        value='true'
                                        checked={formData.isForeigner}
                                        isDisabled={true}
                                        handleInput={() => {}}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type='submit'
                            text='회원정보 수정'
                            variant={isFormValid() ? 'primary' : 'secondary'}
                            size='responsive'
                            disabled={!isFormValid() || isLoading}
                            className={styles['user-edit__submit-button']}
                        />
                    </form>
                </div>
            </section>
        </>
    );
};

export default UserEditForm;
