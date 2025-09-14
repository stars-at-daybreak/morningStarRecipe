import supabase from './supabaseClient.ts';
import type { Signup, SignupData, UpdateUser, UpdateUserData } from '../types/users.ts';

export const signup: Signup = async (signupData: SignupData) => {
    try {
        const { email, password, options } = signupData;

        //todo: 이메일 인증 체크, 닉네임 중복 체크

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nickname: options.nickname,
                    name: options.name,
                    birthDate: options.birthDate,
                    gender: options.gender,
                    isForeigner: options.isForeigner,
                    agreeToTerms: options.agreeToTerms,
                },
            },
        });

        if (error) {
            console.error(error);
            if (error.message === 'User already registered') {
                alert('이미 존재하는 계정입니다.');
            } else if (error.code === 'over_email_send_rate_limit') {
                alert('이 이메일 주소로 너무 많은 이메일이 전송되었습니다. 잠시 후 다시 시도해 주세요.');
            } else if (error.message.includes('Too Many Requests')) {
                alert('너무 많은 회원가입 요청을 하였습니다. 잠시 후 다시 이용해주세요.');
            } else if (error.code === 'weak_password') {
                alert('비밀번호는 최소 6자 이상이어야 합니다.');
            } else {
                alert('회원가입에 실패하였습니다 잠시 후 다시 이용해 주세요');
            }
        } else {
            if (data.user?.identities?.length === 0) {
                alert('이미 가입된 사용자 입니다.');
            } else {
                alert('회원가입이 완료 되었습니다.');
            }
        }
    } catch (error) {
        console.error('회원가입 예외:', error);
        alert('회원가입 처리 중 예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
};

export const signin = async (email: string, password: string): Promise<void> => {
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error(error);
            alert('아이디와 비밀번호를 확인해주세요');
        }
    } catch (error) {
        console.error('로그인 예외:', error);
        alert('로그인 중 예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
};

export const logout = async (): Promise<void> => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('로그아웃 에러:', error.message);
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('로그아웃 예외:', error);
        alert('로그아웃 중 오류가 발생했습니다.');
    }
};

export const updateUser: UpdateUser = async (updateData: UpdateUserData): Promise<boolean> => {
    try {
        const { password, metadata } = updateData;

        const {
            data: { user },
            error: getUserError,
        } = await supabase.auth.getUser();

        if (getUserError || !user) {
            alert('사용자 정보를 가져올 수 없습니다.');
            return false;
        }

        const updatedMetadata = {
            ...metadata,
            agreeToTerms: user.user_metadata.agreeToTerms,
        };

        const { error } = await supabase.auth.updateUser({
            ...(password && { password }),
            data: updatedMetadata,
        });

        if (error) {
            console.error('사용자 정보 업데이트 실패:', error);

            if (error.code === 'weak_password') {
                alert('비밀번호는 최소 6자 이상이어야 합니다.');
            } else if (error.status === 422) {
                alert('동일한 비밀번호로 변경할 수 없습니다.');
            } else {
                alert('정보 업데이트에 실패했습니다. 다시 시도해주세요.');
            }
            return false;
        }

        alert('사용자 정보가 성공적으로 업데이트되었습니다.');
        return true;
    } catch (error) {
        console.error('사용자 정보 업데이트 예외:', error);
        alert('정보 업데이트 중 예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        return false;
    }
};

export const withdraw = async () => {
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user?.id) {
            throw Error('user의 id 정보를 찾을 수 없습니다.');
        }
        const { error } = await supabase.rpc('delete_user');

        if (error) {
            throw error;
        }

        await supabase.auth.signOut();
        alert('회원 탈퇴가 완료되었습니다.');
    } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
};

export const updatePassword = async (email: string, newPassword: string): Promise<boolean> => {
    try {
        const { error } = await supabase.rpc('update_user_password', {
            new_password: newPassword,
            user_email: email,
        });

        if (error) {
            console.error('비밀번호 업데이트 실패:', error);
            alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
            return false;
        }

        alert('비밀번호가 성공적으로 변경되었습니다.');
        return true;
    } catch (error) {
        console.error('비밀번호 변경 예외:', error);
        alert('비밀번호 변경 중 예기치 못한 오류가 발생했습니다.');
        return false;
    }
};

/**
 * 이메일 인증시 이미 가입되어있는 이메일인지 체크하기 위한 이메일 조회
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase.rpc('check_email_exists', {
            user_email: email
        });

        if (error) {
            console.error('이메일 존재 확인 실패:', error);
            return false;
        }

        return data || false;
    } catch (error) {
        console.error('이메일 존재 확인 예외:', error);
        return false;
    }
};
