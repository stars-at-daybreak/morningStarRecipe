import React, { useState } from 'react';
import { signup } from '../../services/supabaseUsers.ts';
import EmailAuthButton from '../../components/EmailAuthButton.tsx';

const SignUp = () => {
    const [email, setEmail] = useState('');

    const signUpHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const signupData = {
            email: data.email as string,
            password: data.password as string,
            options: {
                nickname: data.nickname as string,
                name: data.name as string,
                birthDate: data.birthDate as string,
                gender: data.gender as string,
                isForeigner: data.isForeigner === 'true',
                agreeToTerms: formData.has('agreeToTerms'),
            },
        };

        await signup(signupData);
    };

    return (
        <form onSubmit={signUpHandler}>
            <div>
                <label htmlFor='email'>이메일:</label>
                <input
                    type='email'
                    name='email'
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                />
            </div>
            <EmailAuthButton email={email} />
            <div>
                <label htmlFor='password'>비밀번호</label>
                <input type='password' name='password' required />
            </div>
            <div>
                <label htmlFor='nickname'>닉네임</label>
                <input type='text' name='nickname' required />
            </div>
            <div>
                <label htmlFor='name'>이름</label>
                <input type='text' name='name' required />
            </div>
            <div>
                <label htmlFor='birthDate'>생년월일</label>
                <input type='number' name='birthDate' required />
            </div>
            <div>
                <label htmlFor='male'>남</label>
                <input type='radio' id='male' name='gender' value='M' required />
                <label htmlFor='female'>여</label>
                <input type='radio' id='female' name='gender' value='F' required />
            </div>
            <div>
                <label htmlFor='korean'>내국인</label>
                <input type='radio' id='korean' name='isForeigner' value='false' required />
                <label htmlFor='korean'>외국인</label>
                <input type='radio' id='foreigner' name='isForeigner' value='true' required />
            </div>
            <div>
                <label htmlFor='agreeToTerms'>동의여부</label>
                <input type='checkbox' name='agreeToTerms' required />
            </div>
            <button type='submit'>회원가입</button>
        </form>
    );
};

export default SignUp;
