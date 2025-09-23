import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageSetup } from '../../hooks/usePageSetup';
import useUserStore from '../../stores/useUserStore';
import supabase from '../../services/supabaseClient';
import styles from './passwordVerification.module.css';
import InputText from '../../components/input/InputText';
import Button from '../../components/button/Button';
import ResponsiveLogo from '../../components/logo/ResponsiveLogo';

const PasswordVerification = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const [password, setPassword] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const [error, setError] = useState('');

    const verifyPasswordHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.email) {
            setError('사용자 정보를 찾을 수 없습니다.');
            return;
        }

        try {
            // Supabase를 사용한 실제 비밀번호 검증
            const { error } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: password,
            });

            if (error) {
                console.error('비밀번호 인증 실패:', error);
                setError('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
                return;
            }

            // 비밀번호가 맞으면 회원정보 수정 페이지로 이동
            navigate('/mypage/user-edit');
        } catch (error) {
            console.error('비밀번호 인증 에러:', error);
            setError('비밀번호 인증 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
        if (error) setError(''); // 에러 메시지 초기화
    };

    usePageSetup({
        title: '회원정보 수정',
        pageName: 'password-verification',
        showBackButton: true,
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setIsDisabled(!password || password.length < 8);
    }, [password, user, navigate]);

    if (!user) {
        return null;
    }

    return (
        <>
            <title>본인 확인 - 모두의 부엌 </title>
            <meta name='description' content='개인정보를 안전하게 보호하기 위해 인증 절차가 필요합니다.' />
            <meta name='robots' content='noindex, nofollow' />
            <link rel='canonical' href='https://morningstarrecipe.netlify.app/mypage/password-verification' />

            <section className={styles['password-verification']}>
                <div className={styles['password-verification__container']}>
                    <div className={styles['password-verification__header']}>
                        <h2 className={styles['password-verification__logo']}>
                            <ResponsiveLogo />
                        </h2>
                        <p className={styles['password-verification__description']}>
                            개인정보를 안전하게 보호하기 위해
                            <br />
                            <strong>인증 절차</strong>가 필요합니다
                        </p>
                    </div>

                    <form onSubmit={verifyPasswordHandler} className={styles['password-verification__form']}>
                        <div className={styles['password-verification__input-group']}>
                            <InputText
                                label='이메일'
                                id='email'
                                state={user.email || ''}
                                type='email'
                                handleInput={() => {}} // 수정 불가능
                                placeholder=''
                                isDisabled={true}
                                className='input__label--active'
                            />

                            <InputText
                                label='비밀번호'
                                id='password'
                                state={password}
                                type='password'
                                handleInput={handleInput}
                                placeholder='비밀번호를 입력해주세요'
                            />

                            <div className={styles['password-verification__error-wrap']}>
                                {error && <p className={styles['password-verification__error']}>{error}</p>}
                            </div>
                        </div>

                        <Button
                            type='submit'
                            text='회원정보 수정'
                            variant={isDisabled ? 'secondary' : 'primary'}
                            size='responsive'
                            disabled={isDisabled}
                            className={styles['password-verification__submit-button']}
                        />
                    </form>
                </div>
            </section>
        </>
    );
};

export default PasswordVerification;
