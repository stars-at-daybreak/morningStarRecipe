import React, { useRef } from 'react';
import { useFileUpload } from '../../hooks/useImageUpload';
import plus_icon from '../../assets/plus_icon.png';
import styles from './ImgUpload.module.css';

export const ResponsiveFileUpload = () => {
    const { uploadFile, isUploading } = useFileUpload();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const filename = await uploadFile(file);
        if (filename) {
            console.log('업로드된 파일명:', filename);
        }
    };

    const openFileSelector = () => {
        fileInputRef.current?.click();
    };

    const buttonClassName = `${styles['image-upload__trigger-button']} ${
        isUploading ? styles['image-upload__trigger-button--uploading'] : ''
    }`;

    return (
        <section className={styles['image-upload']} aria-label='이미지 업로드'>
            <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleFileSelect}
                className={styles['image-upload__file-input']}
                id='image-upload-input'
                aria-label='이미지 파일 선택'
            />
            <button
                type='button'
                onClick={openFileSelector}
                disabled={isUploading}
                className={buttonClassName}
                aria-describedby='upload-status'
                aria-label={isUploading ? '이미지 업로드 중' : '이미지 업로드'}
            >
                <img
                    src={plus_icon}
                    alt='이미지 추가'
                    className={styles['image-upload__plus-icon']}
                    role='presentation'
                />
            </button>
        </section>
    );
};
