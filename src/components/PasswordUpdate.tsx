import { useState } from 'react';
import { updatePassword } from '../services/supabaseUsers.ts';

const PasswordUpdate = ({ email }: { email: string }) => {
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password1 === password2) {
            await updatePassword(email, password2);
        }
    };

    return (
        <form onSubmit={e => handlePasswordUpdate(e)}>
            <label htmlFor='password1'>비밀번호</label>
            <input type='password' value={password1} onChange={e => setPassword1(e.target.value)} />
            <label htmlFor='password2'>비밀번호 확인</label>
            <input type='password' value={password2} onChange={e => setPassword2(e.target.value)} />
            <button type='submit'>비밀번호 변경</button>
        </form>
    );
};

export default PasswordUpdate;
