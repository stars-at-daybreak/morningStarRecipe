import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageSetup } from '../../hooks/usePageSetup';
import { useModal } from '../../components/modal/ModalContext';
import useUserStore from '../../stores/useUserStore';
import styles from './deleteAccount.module.css';
import ResponsiveLogo from '../../components/logo/ResponsiveLogo';
import InputText from '../../components/input/InputText';
import Button from '../../components/button/Button';
import ValidationText from '../../components/validation/ValidationText';

const DeleteAccount = () => {
    const navigate = useNavigate();
    const { user } = useUserStore(); // clearUser 제거
    const { openModal } = useModal();
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [showEmailError, setShowEmailError] = useState(false);

    const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleDeleteAccount = () => {
        if (!user || user.email !== email) {
            setShowEmailError(true);
            return;
        }

        openModal('DELETE_ACCOUNT', undefined, undefined);
    };

    useEffect(() => {
        setIsEmailValid(validateEmail(email));
        if (email && user?.email && email === user.email) {
            setShowEmailError(false);
        }
    }, [email, user?.email]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    usePageSetup({
        title: '회원탈퇴',
        pageName: 'deleteAccount',
        showBackButton: true,
    });

    if (!user) {
        return null;
    }

    return (
        <section className={styles['delete-account']}>
            <div className={styles['delete-account__content']}>
                <div className={styles['delete-account__logo_wrap']}>
                    <div className={styles['delete-account__logo']}>
                        <ResponsiveLogo />
                    </div>
                    <p className={styles['delete-account__description']}>
                        탈퇴하시면 <strong>즉시 모든 계정정보가 삭제</strong>되며
                        <br />
                        재가입 시에도 이용내역은 복구되지않습니다.
                    </p>
                </div>

                <form className={styles['delete-account__form']}>
                    <div className={styles['delete-account__form_email']}>
                        <InputText
                            label='이메일'
                            id='email'
                            name='email'
                            state={email}
                            type='email'
                            handleInput={handleEmailInput}
                            placeholder='이메일을 입력해주세요.'
                            isRequired={true}
                            className={isEmailValid ? 'input__label--active' : ''}
                        />
                        <ValidationText
                            isPassed={showEmailError ? false : null}
                            text='이메일이 맞지않습니다. 다시 확인해 주세요.'
                        />
                    </div>

                    <Button
                        type='button'
                        text='회원탈퇴'
                        variant={isEmailValid ? 'primary' : 'secondary'}
                        size='responsive'
                        disabled={!isEmailValid}
                        onClick={handleDeleteAccount}
                        className={styles['delete-account__submit-button']}
                    />
                </form>
            </div>
        </section>
    );
};

export default DeleteAccount;
