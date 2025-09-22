import React, { useState } from 'react';
import ResponsiveLogo from '../../components/logo/ResponsiveLogo.tsx';
import InputText from '../../components/input/InputText.tsx';
import Button from '../../components/button/Button.tsx';
import styles from './emailAuthentication.module.css';
import { usePageSetup } from '../../hooks/usePageSetup.tsx';
import { sendVerificationCode } from '../../services/supabaseEmailAuth.ts';
import EmailAuthModal from '../../components/modal/EmailAuthModal.tsx';
import { useNavigate } from 'react-router-dom';
import { checkEmailExists } from '../../services/supabaseUsers.ts';
import { useModal } from '../../components/modal/ModalContext.ts';

const EmailAuthentication = () => {
    const [isDisabled, setIsDisabled] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const { openModal } = useModal();

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
        setIsDisabled(false);
    };

    const emailAuthentication = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const emailExists = await checkEmailExists(email);
        if (!emailExists) {
            openModal('FAIL', undefined, '일치하는 회원정보가 없습니다.');
            return;
        }

        const result = await sendVerificationCode(email);

        if (result.success) {
            setIsDisabled(true);
            setIsOpen(true);
        }
    };

    const handleModal = (isOpen: boolean) => {
        setIsOpen(isOpen);
    };

    const handleAuthConfirm = (isConfirm: boolean) => {
        if (isConfirm) {
            navigate('/password/update', {
                state: { isAuthenticated: true, email: email },
                replace: true,
            });
        }
    };

    usePageSetup({
        title: '이메일 인증',
        pageName: 'email-authentication',
        showBackButton: true,
    });

    return (
        <section className={styles['email-authentication']}>
            <div className={styles['email-authentication__container']}>
                <div className={styles['email-authentication__header']}>
                    <h2 className={styles['email-authentication__logo']}>
                        <ResponsiveLogo />
                    </h2>
                    <p className={styles['email-authentication__description']}>
                        개인정보를 안전하게 보호하기 위해
                        <br />
                        <strong>인증 절차</strong>가 필요합니다
                    </p>
                </div>

                <form onSubmit={emailAuthentication} className={styles['email-authentication__form']}>
                    <div className={styles['email-authentication__input-group']}>
                        <InputText
                            label='이메일'
                            id='email'
                            state={email}
                            type='email'
                            handleInput={handleInput}
                            placeholder='이메일을 입력해주세요'
                            isDisabled={false}
                            className='input__label--active'
                        />
                    </div>

                    <Button
                        type='submit'
                        text='이메일 인증'
                        variant={isDisabled ? 'secondary' : 'primary'}
                        size='responsive'
                        disabled={isDisabled}
                        className={styles['email-authentication__submit-button']}
                    />
                </form>
            </div>

            {isOpen && (
                <EmailAuthModal
                    email={email}
                    handleModal={isOpen => handleModal(isOpen)}
                    handleAuthConfirm={isConfirm => handleAuthConfirm(isConfirm)}
                />
            )}
        </section>
    );
};

export default EmailAuthentication;
