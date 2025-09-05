import React, { useState } from 'react';
import { Signin } from '../../services/supabaseUsers.ts';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signInHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        await Signin(email, password);
    };

    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.type === 'email') setEmail(e.target.value);
        if (e.target.type === 'password') setPassword(e.target.value);
    };

    return (
        <>
            <form onSubmit={signInHandler}>
                <div>
                    <label htmlFor='email'>이메일:</label>
                    <input type='email' id='email' value={email} onChange={inputHandler} />
                </div>
                <div>
                    <label htmlFor='password'>비밀번호</label>
                    <input type='password' id='password' value={password} onChange={inputHandler} />
                </div>
                <button type='submit'>로그인</button>
            </form>
        </>
    );
};

export default Login;
