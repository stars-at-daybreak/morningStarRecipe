import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updatePassword } from '../../services/supabaseUsers.ts';
import { useModal } from '../../components/modal/ModalContext.ts';
import { validatePassword } from '../../utils/utils.ts';
import ResponsiveLogo from '../../components/logo/ResponsiveLogo.tsx';
import InputText from '../../components/input/InputText.tsx';
import styles from './passwordUpdate.module.css';
import Button from '../../components/button/Button.tsx';

const PasswordUpdate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = location.state?.isAuthenticated || false;
    const email = location.state?.email;
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { openModal } = useModal();

    const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password1 === password2) {
            const isPasswordValid = validatePassword(password2);
            if (isPasswordValid) {
                await updatePassword(email, password2);
                openModal('SUCCESS', '/login', '비밀번호가 변경되었습니다.');
            } else {
                openModal('FAIL', undefined, '비밀번호는 영문, 숫자, 특수문자 포함 8-15자로 입력해주세요.');
                setErrorMessage('영문, 숫자, 특수문자 포함 8-15자로 입력해주세요.');
            }
        } else {
            setErrorMessage('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            openModal('FAIL', undefined, '비밀번호를 올바르게 입력해 주세요.');
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, []);

    return (
        <div className={styles['password-container']}>
            <h2>
                <ResponsiveLogo />
            </h2>
            <form onSubmit={handlePasswordUpdate}>
                <div className={styles['password1']}>
                    <InputText
                        id='password1'
                        label='새 비밀번호 입력'
                        type='password'
                        placeholder='영문, 숫자, 특수문자 포함 8-15자로 입력해주세요.'
                        state={password1}
                        handleInput={e => setPassword1(e.target.value)}
                    />
                </div>
                <div className={styles['password2']}>
                    <InputText
                        id='password2'
                        label='새 비밀번호 확인'
                        type='password'
                        placeholder='확인을 위해 비밀번호를 한 번 더 입력해주세요.'
                        state={password2}
                        handleInput={e => setPassword2(e.target.value)}
                    />
                </div>
                {errorMessage && <span>{errorMessage}</span>}

                <Button type='submit' text='비밀번호 변경' size='responsive' />
            </form>
        </div>
    );
};

export default PasswordUpdate;
