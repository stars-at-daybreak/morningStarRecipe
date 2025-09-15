export class EmailAlreadyExistsError extends Error {
    constructor(message: string = '이미 가입된 이메일입니다.') {
        super(message);
        this.name = 'EmailAlreadyExistsError';
    }
}
