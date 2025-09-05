export interface SignupData {
    email: string;
    password: string;
    options: {
        nickname: string;
        name: string;
        birthDate: string;
        gender: string;
        isForeigner: boolean;
        agreeToTerms: boolean;
    };
}
export type Signup = (signupData: SignupData) => Promise<void>;

export interface UpdateUserData {
    password?: string;
    metadata: {
        nickname: string;
        name: string;
        birthDate: string;
        gender: string;
        isForeigner: boolean;
    };
}
export type UpdateUser = (updateData: UpdateUserData) => Promise<boolean>;
