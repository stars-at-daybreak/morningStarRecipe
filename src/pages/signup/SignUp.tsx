import React, { useState, useEffect } from 'react';
import { signup } from '../../services/supabaseUsers.ts';
import EmailAuthButton from '../../components/EmailAuthButton.tsx';
import { usePageSetup } from '../../hooks/usePageSetup.tsx';
import styles from './signup.module.css';
import ResponsiveLogo from '../../components/logo/ResponsiveLogo.tsx';
import InputText from '../../components/input/InputText.tsx';
import Button from '../../components/button/Button.tsx';
import InputRadio from '../../components/input/InputRadio.tsx';
import { privacyPolicy, termsOfService } from '../../data/termsOfService.ts';
import type { SignupData } from '../../types/users.ts';
import EmailAuthModal from '../../components/modal/EmailAuthModal.tsx';

const SignUp = () => {
    const [isDisabled, setIsDisabled] = useState(true);
    const [checkedItems, setCheckedItems] = useState(new Set());
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthConfirm, setIsAuthConfirm] = useState(false);

    const [formData, setFormData] = useState<
        SignupData & {
            password2: string;
        }
    >({
        email: '',
        password: '',
        password2: '',
        options: {
            nickname: '',
            name: '',
            birthDate: '',
            gender: '',
            isForeigner: null,
            agreeToTerms: false,
        },
    });

    const signUpHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await signup(formData);
    };

    const handleCheck = (itemId: string) => {
        setCheckedItems(prev => {
            const newSet = new Set(prev);

            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }

            return newSet;
        });
    };

    const handleAllAgree = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            handleCheck('agreeToTerms1');
            handleCheck('agreeToTerms2');
        } else {
            setCheckedItems(new Set());
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        switch (e.target.name) {
            case 'email':
                setFormData(prevState => ({
                    ...prevState,
                    email: value,
                }));
                break;
            case 'nickname':
                setFormData(prevState => ({
                    ...prevState,
                    options: {
                        ...prevState.options,
                        nickname: value,
                    },
                }));
                break;
            case 'password':
                setFormData(prevState => ({
                    ...prevState,
                    password: value,
                }));
                break;
            case 'password2':
                setFormData(prevState => ({
                    ...prevState,
                    password2: value,
                }));
                break;
            case 'name':
                setFormData(prevState => ({
                    ...prevState,
                    options: {
                        ...prevState.options,
                        name: value,
                    },
                }));
                break;
            case 'birthDate':
                setFormData(prevState => ({
                    ...prevState,
                    options: {
                        ...prevState.options,
                        birthDate: value,
                    },
                }));
                break;
            case 'gender':
                setFormData(prevState => ({
                    ...prevState,
                    options: {
                        ...prevState.options,
                        gender: value,
                    },
                }));
                break;
            case 'isForeigner':
                setFormData(prevState => ({
                    ...prevState,
                    options: {
                        ...prevState.options,
                        isForeigner: value === 'true',
                    },
                }));
                break;
        }
    };

    const handleAuthConfirm = (isConfirm: boolean) => {
        setIsAuthConfirm(isConfirm);
    };

    useEffect(() => {
        const isFormValid =
            formData.email &&
            isAuthConfirm &&
            formData.options.nickname &&
            formData.password &&
            formData.password2 &&
            formData.password === formData.password2 &&
            formData.options.name &&
            formData.options.birthDate &&
            formData.options.gender &&
            typeof formData.options.isForeigner === 'boolean' &&
            checkedItems.has('agreeToTerms1') &&
            checkedItems.has('agreeToTerms2');

        setIsDisabled(!isFormValid);
    }, [formData, isAuthConfirm, checkedItems]);

    usePageSetup({
        title: '회원가입',
        pageName: 'signup',
        showBackButton: true,
    });

    return (
        <div className={styles['signup']}>
            <div>
                <ResponsiveLogo />
            </div>

            <form className={styles['signup__form']} onSubmit={signUpHandler}>
                <fieldset className={styles['signup__email-box']}>
                    <legend className='sr-only'>이메일 인증</legend>

                    <InputText
                        label='이메일'
                        id='email'
                        name='email'
                        state={formData.email}
                        type='email'
                        handleInput={handleInput}
                        placeholder='이메일 주소를 입력해주세요.'
                        isRequired={true}
                        isDisabled={isAuthConfirm}
                    />
                    <EmailAuthButton
                        handleModal={(isOpen: boolean) => setIsOpen(isOpen)}
                        isConfirm={isAuthConfirm}
                        email={formData.email}
                    />
                </fieldset>

                <fieldset className={styles['signup__nickname-box']}>
                    <legend className='sr-only'>닉네임 중복확인</legend>

                    <InputText
                        label='닉네임'
                        id='nickname'
                        name='nickname'
                        state={formData.options.nickname}
                        type='text'
                        handleInput={handleInput}
                        placeholder='닉네임을 입력해주세요.'
                        isRequired={true}
                    />
                    <button type='button'>중복확인</button>
                </fieldset>

                <fieldset className={styles['signup__password-group']}>
                    <legend className='sr-only'>비밀번호 입력 및 확인</legend>

                    <InputText
                        label='비밀번호 입력'
                        id='password'
                        name='password'
                        state={formData.password}
                        type='password'
                        handleInput={handleInput}
                        placeholder='영문, 숫자, 특수문자 포함 8-15자로 입력해주세요.'
                        isRequired={true}
                    />
                    <InputText
                        label='비밀번호 확인'
                        id='password2'
                        name='password2'
                        state={formData.password2}
                        type='password'
                        handleInput={handleInput}
                        placeholder='확인을 위해 비밀번호를 한 번 더 입력해주세요.'
                        isRequired={true}
                    />
                </fieldset>

                <fieldset className={styles['signup__personal-group']}>
                    <legend className='sr-only'>개인 정보</legend>

                    <InputText
                        label='이름'
                        id='name'
                        name='name'
                        state={formData.options.name}
                        type='text'
                        handleInput={handleInput}
                        placeholder='실명을 입력해주세요'
                        isRequired={true}
                    />
                    <InputText
                        label='생년월일'
                        id='birthDate'
                        name='birthDate'
                        state={formData.options.birthDate}
                        type='text'
                        handleInput={handleInput}
                        placeholder='생년월일을 입력해주세요'
                        isRequired={true}
                    />
                </fieldset>

                <fieldset className={styles['signup__gender-group']}>
                    <legend>성별</legend>

                    <div className={styles['signup__radio-group']}>
                        <InputRadio
                            id='male'
                            name='gender'
                            value='M'
                            label='남성'
                            handleInput={handleInput}
                            isRequired={true}
                        />
                        <InputRadio
                            id='female'
                            name='gender'
                            value='F'
                            label='여성'
                            handleInput={handleInput}
                            isRequired={true}
                        />
                    </div>
                </fieldset>
                <fieldset className={styles['signup__isForeigner-group']}>
                    <legend>내국인</legend>

                    <div className={styles['signup__radio-group']}>
                        <InputRadio
                            id='korean'
                            name='isForeigner'
                            value='false'
                            label='내국인'
                            handleInput={handleInput}
                            isRequired={true}
                        />
                        <InputRadio
                            id='foreigner'
                            name='isForeigner'
                            value='true'
                            label='외국인'
                            handleInput={handleInput}
                            isRequired={true}
                        />
                    </div>
                </fieldset>

                <fieldset className={styles['signup__agree']}>
                    <legend className='sr-only'>회원가입 약관 동의</legend>

                    <input type='checkbox' id='agreeToAll' onChange={handleAllAgree} />
                    <label htmlFor='agreeToAll'>필수 전체 약관에 동의합니다.</label>

                    <div className={styles['signup__terms-box']}>
                        <p className={styles['signup__terms-content']}>{termsOfService}</p>
                    </div>
                    <input
                        type='checkbox'
                        id='agreeToTerms1'
                        name='agreeToTerms'
                        onChange={() => handleCheck('agreeToTerms1')}
                        checked={checkedItems.has('agreeToTerms1')}
                        required
                    />
                    <label htmlFor='agreeToTerms1'>서비스 이용약관.(필수)</label>

                    <div className={styles['signup__terms-box']}>
                        <p className={styles['signup__terms-content']}>{privacyPolicy}</p>
                    </div>
                    <input
                        type='checkbox'
                        id='agreeToTerms2'
                        name='agreeToTerms'
                        onChange={() => handleCheck('agreeToTerms2')}
                        checked={checkedItems.has('agreeToTerms2')}
                        required
                    />
                    <label htmlFor='agreeToTerms2'>개인정보 수집 및 이용.(필수)</label>
                </fieldset>

                <Button
                    type='submit'
                    text='회원가입'
                    variant={isDisabled ? 'secondary' : 'primary'}
                    size='responsive'
                    disabled={isDisabled}
                    className={styles['login__submit-button']}
                />
            </form>

            {isOpen && (
                <EmailAuthModal
                    handleModal={(isOpen: boolean) => setIsOpen(isOpen)}
                    handleAuthConfirm={(isConfirm: boolean) => handleAuthConfirm(isConfirm)}
                    email={formData.email}
                />
            )}
        </div>
    );
};

export default SignUp;
