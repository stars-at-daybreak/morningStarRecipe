import React, { useEffect, useState } from 'react';
import { signin } from '../../services/supabaseUsers.ts';
import styles from './login.module.css';
import { usePageSetup } from '../../hooks/usePageSetup.tsx';
import InputText from '../../components/input/InputText.tsx';
import Button from '../../components/button/Button.tsx';
import { Link } from 'react-router-dom';
import ResponsiveLogo from '../../components/logo/ResponsiveLogo.tsx';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);

    const signInHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        await signin(email, password);
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
    );
};

export default Login;
