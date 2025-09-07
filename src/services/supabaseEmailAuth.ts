// 이메일 인증 요청
import supabase from './supabaseClient.ts';

export const sendVerificationCode = async (
    email: string
): Promise<{ success: boolean; message: string; code?: string }> => {
    try {
        // 6자리
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const { error: dbError } = await supabase.from('email_verifications').insert({
            email,
            code,
            expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10분
        });

        if (dbError) {
            console.error('DB 저장 실패:', dbError);
            return {
                success: false,
                message: `데이터베이스 저장 실패: ${dbError.message}`,
            };
        }

        const { data: functionData, error: functionError } = await supabase.functions.invoke(
            'send-verification-email',
            {
                body: { email, code },
            }
        );

        if (functionError) {
            console.error('Edge Function 호출 실패:', functionError);
            return {
                success: false,
                message: `이메일 발송 실패: ${functionError.message}`,
            };
        }

        return {
            success: true,
            message: '인증 코드가 성공적으로 전송되었습니다.',
            code: functionData?.developmentCode || undefined, // 개발 모드에서만
        };
    } catch (error) {
        console.error('예상치 못한 오류:', error);
        return {
            success: false,
            message: `예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        };
    }
};
