import { useState } from 'react';

interface UploadResponse {
    message: string;
    info: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        destination: string;
        filename: string;
        path: string;
        size: number;
    };
}
interface UseFileUploadReturn {
    uploadFile: (file: File) => Promise<string | null>;
    isUploading: boolean;
    error: string | null;
    resetError: () => void;
}

const apiUrl: string = import.meta.env.VITE_API_BASE_URL;

export const useFileUpload = (): UseFileUploadReturn => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = async (file: File): Promise<string | null> => {
        setIsUploading(true);
        setError(null);

        try {
            const MAX_FILE_SIZE = 10 * 1024 * 1024;
            if (file.size > MAX_FILE_SIZE) {
                throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
            }

            const formData = new FormData();
            formData.append('image', file); // 'files' -> 'file'로 변경

            const response = await fetch(`${apiUrl}/image/uploadfile`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: UploadResponse = await response.json();

            return data?.info.filename || null;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '파일 업로드 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('File upload error:', err);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const resetError = () => setError(null);

    return {
        uploadFile,
        isUploading,
        error,
        resetError,
    };
};
