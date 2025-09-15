import { useState } from 'react';

const PasswordFind = () => {
    const [email, setEmail] = useState('');

    return (
        <div>
            <p>비밀번호 찾기</p>
            <label htmlFor='email'>이메일</label>
            <input type='email' id='email' value={email} onChange={e => setEmail(e.target.value)} />
        </div>
    );
};

export default PasswordFind;
