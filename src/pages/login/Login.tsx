import React, { useState } from 'react';
import { signin } from '../../services/supabaseUsers.ts';
import loginLogoMobile from '../../assets/login_logo_mobile.svg';
import loginLogoTablet from '../../assets/login_logo_tablet.svg';
import styles from './login.module.css';
import { usePageSetup } from '../../hooks/usePageSetup.tsx';
import Input from '../../components/input/Input.tsx';
import Button from '../../components/button/Button.tsx';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);

    const signInHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        await signin(email, password);
    };

    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.type === 'email') setEmail(e.target.value);
        if (e.target.type === 'password') setPassword(e.target.value);

        if (email && password) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    };

    usePageSetup({
        title: '로그인',
        pageName: 'login',
        showBackButton: true,
    });

    return (
        <div className={styles['login']}>
            <section>
                <h2>
                    <picture>
                        <source media='(min-width: 1024px)' srcSet={loginLogoTablet} />
                        <img src={loginLogoMobile} alt='모두의 부엌 로고' />
                    </picture>
                </h2>
            </section>
            <form onSubmit={signInHandler} className={styles['login__form']}>
                <Input
                    label='이메일'
                    id='email'
                    state={email}
                    type='email'
                    inputHandler={inputHandler}
                    placeholder='이메일을 입력해주세요'
                />
                <Input
                    label='비밀번호'
                    id='password'
                    state={password}
                    type='password'
                    inputHandler={inputHandler}
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
    );
};

export default Login;
