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

const SignUp = () => {
    const [isDisabled, setIsDisabled] = useState(true);
    const [checkedItems, setCheckedItems] = useState(new Set());
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

    useEffect(() => {
        const isFormValid =
            formData.email &&
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
        console.log('formData', formData);
    }, [formData, checkedItems]);

    usePageSetup({
        title: '회원가입',
        pageName: 'signup',
        showBackButton: true,
    });

    return (
        <div className={styles['signup']}>
            <section>
                <h2>
                    <ResponsiveLogo />
                </h2>
            </section>
            <form className={styles['signup__form']} onSubmit={signUpHandler}>
                <InputText
                    label='이메일'
                    id='email'
                    name='email'
                    state={formData.email}
                    type='email'
                    handleInput={handleInput}
                    placeholder='이메일 주소를 입력해주세요.'
                    isRequired={true}
                />
                <EmailAuthButton email={formData.email} />
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

                <div>
                    <label htmlFor='agreeToTerms2'>서비스 이용약관.(필수)</label>
                    <input
                        type='checkbox'
                        id='agreeToTerms2'
                        name='agreeToTerms2'
                        onChange={() => handleCheck('agreeToTerms2')}
                        required
                    />
                    <div className='signup__terms-box'>{termsOfService}</div>
                    <label htmlFor='agreeToTerms1'>개인정보 수집 및 이용.(필수)</label>
                    <input
                        type='checkbox'
                        id='agreeToTerms1'
                        name='agreeToTerms1'
                        onChange={() => handleCheck('agreeToTerms1')}
                        required
                    />
                    <div className='signup__terms-box'>{privacyPolicy}</div>
                </div>

                <Button
                    type='submit'
                    text='회원가입'
                    variant={isDisabled ? 'secondary' : 'primary'}
                    size='responsive'
                    disabled={isDisabled}
                    className={styles['login__submit-button']}
                />
            </form>
        </div>
    );
};

export default SignUp;
