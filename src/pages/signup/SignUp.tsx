import React, { useState } from 'react';
import supabase from '../../services/SupabaseClient.ts';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signUpHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                console.error('에러발생:', error.message);
                if (error.message === 'User already registered') {
                    alert('이미 존재하는 계정입니다');
                } else {
                    alert('아이디와 비밀번호를 확인해주세요');
                }
            } else {
                alert('회원가입에 성공하였습니다!');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.type === 'email') setEmail(e.target.value);
        if (e.target.type === 'password') setPassword(e.target.value);
    };

    return (
        <form onSubmit={signUpHandler}>
            <div>
                <label htmlFor='email'>이메일:</label>
                <input type='email' id='email' value={email} onChange={inputHandler} />
            </div>
            <div>
                <label htmlFor='password'>비밀번호</label>
                <input type='password' id='password' value={password} onChange={inputHandler} />
            </div>
            <button type='submit'>회원가입</button>
        </form>
    );
};

export default SignUp;
