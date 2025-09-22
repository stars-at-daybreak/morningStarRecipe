import React, { useEffect, useState } from 'react';
import styles from './youtubeModal.module.css';

const YoutubeModal = ({
    handleModal,
    handleYoutubeUrl,
}: {
    handleModal: (isOpen: boolean) => void;
    handleYoutubeUrl: (youtubeUrl: string) => void;
}) => {
    const [youtubeUrl, setYoutubeUrl] = useState('');

    const handleConfirm = async (type: 'confirm' | 'cancel') => {
        if (type === 'confirm') {
            handleYoutubeUrl(youtubeUrl);
            handleModal(false);
        } else {
            handleYoutubeUrl('');
            handleModal(false);
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className={styles['modal-overlay']}>
            <div className={styles['youtube-modal']}>
                <div className={styles['youtube-modal__contents-box']}>
                    <p className={styles['youtube-modal__contents']}>YouTube URL을 입력하세요</p>
                    <input
                        className={styles['youtube-modal__input']}
                        type='text'
                        value={youtubeUrl}
                        onChange={e => setYoutubeUrl(e.target.value)}
                    />
                </div>
                <div className={styles['youtube-modal__btn-group']}>
                    <button
                        className={styles['youtube-modal__btn']}
                        type='button'
                        onClick={() => handleConfirm('cancel')}
                    >
                        취소
                    </button>
                    <div className={styles['youtube-modal__btn-line']}></div>
                    <button
                        className={styles['youtube-modal__btn']}
                        type='button'
                        onClick={() => handleConfirm('confirm')}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default YoutubeModal;
