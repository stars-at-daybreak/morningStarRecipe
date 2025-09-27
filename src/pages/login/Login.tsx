import React, { useEffect, useState } from 'react';
import { signin } from '../../services/supabaseUsers.ts';
import styles from './login.module.css';
import { usePageSetup } from '../../hooks/usePageSetup.tsx';
import InputText from '../../components/input/InputText.tsx';
import Button from '../../components/button/Button.tsx';
import { Link } from 'react-router-dom';
import ResponsiveLogo from '../../components/logo/ResponsiveLogo.tsx';
import { useModal } from '../../components/modal/ModalContext.ts';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const { openModal } = useModal();

    const signInHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await signin(email, password);
        if (result.status === 'FAIL') {
            openModal(result.status, undefined, result.text);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.type === 'email') setEmail(e.target.value);
        if (e.target.type === 'password') setPassword(e.target.value);
    };

    usePageSetup({
        title: '로그인',
        pageName: 'login',
        showBackButton: true,
    });

    useEffect(() => {
        setIsDisabled(!(email && password));
    }, [email, password]);

    return (
        <>
            <title>로그인 - 모두의 부엌</title>
            <meta
                name='description'
                content='모두의 부엌에 로그인하여 나만의 레시피를 공유하고 재료 나눔에 참여하세요.'
            />
            <meta property='og:title' content='로그인 - 모두의 부엌' />
            <meta
                property='og:description'
                content='모두의 부엌에 로그인하여 나만의 레시피를 공유하고 재료 나눔에 참여하세요.'
            />
            <meta property='og:image' content='https://morningstarrecipe.netlify.app/assets/og_logo.png' />
            <meta property='og:type' content='website' />
            <meta property='og:url' content='https://morningstarrecipe.netlify.app/login' />
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content='로그인 - 모두의 부엌' />
            <meta
                name='twitter:description'
                content='모두의 부엌에 로그인하여 나만의 레시피를 공유하고 재료 나눔에 참여하세요.'
            />
            <meta name='twitter:image' content='https://morningstarrecipe.netlify.app/assets/og_logo.png' />
            <meta name='twitter:url' content='https://morningstarrecipe.netlify.app/login' />
            <meta name='keywords' content='레시피.jpg' />
            <meta name='robots' content='noindex, nofollow' />
            <link rel='canonical' href='https://morningstarrecipe.netlify.app/login' />

            <div className={styles['login']}>
                <section>
                    <h2>
                        <ResponsiveLogo />
                    </h2>
                </section>
                <form onSubmit={signInHandler} className={styles['login__form']}>
                    <InputText
                        label='이메일'
                        id='email'
                        state={email}
                        type='email'
                        handleInput={handleInput}
                        placeholder='이메일을 입력해주세요'
                    />
                    <InputText
                        label='비밀번호'
                        id='password'
                        state={password}
                        type='password'
                        handleInput={handleInput}
                        placeholder='비밀번호를 입력해주세요'
                    />
                    <Button
                        type='submit'
                        text='로그인'
                        variant={isDisabled ? 'secondary' : 'primary'}
                        size='responsive'
                        disabled={isDisabled}
                        className={styles['login__submit-button']}
                    />
                </form>
                <section className={styles['login__link-group']}>
                    <Link to='/signup'>회원가입</Link>
                    <Link to='/password'>비밀번호 찾기</Link>
                </section>
            </div>
        </>
    );
};

export default Login;
