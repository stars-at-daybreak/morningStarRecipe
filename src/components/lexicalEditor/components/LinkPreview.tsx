import React, { useEffect, useState } from 'react';
import { fetchLinkMetadata, LinkMetadata } from '../../../utils/linkPreview';
import styles from './linkPreview.module.css';

interface LinkPreviewProps {
    url: string;
}

export default function LinkPreview({ url }: LinkPreviewProps): JSX.Element {
    const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        const loadMetadata = async () => {
            try {
                setLoading(true);
                setError(false);

                // 9초 후 강제 타임아웃
                timeoutId = setTimeout(() => {
                    if (isMounted) {
                        setError(true);
                        setLoading(false);
                    }
                }, 9000);

                const meta = await fetchLinkMetadata(url);

                if (isMounted) {
                    clearTimeout(timeoutId);
                    setMetadata(meta);
                }
            } catch {
                if (isMounted) {
                    setError(true);
                }
            } finally {
                if (isMounted) {
                    clearTimeout(timeoutId);
                    setLoading(false);
                }
            }
        };

        void loadMetadata();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [url]);

    if (loading) {
        return (
            <span className={styles.linkPreview}>
                <span className={styles.loading}>
                    <span className={styles.loadingSpinner}></span>
                    <span>링크 정보를 불러오는 중...</span>
                </span>
            </span>
        );
    }

    if (error || !metadata) {
        return (
            <span className={styles.linkPreview}>
                <span className={styles.fallback}>
                    <span className={styles.fallbackIcon}>🔗</span>
                    <span className={styles.fallbackUrl}>{url}</span>
                </span>
            </span>
        );
    }

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <span className={styles.linkPreview} onClick={handleClick}>
            <span className={styles.previewCard}>
                {metadata.image && (
                    <span className={styles.imageContainer}>
                        <img
                            src={metadata.image}
                            alt={metadata.title || '링크 이미지'}
                            className={styles.previewImage}
                            onError={e => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                            crossOrigin={'anonymous'}
                        />
                    </span>
                )}
                <span className={styles.textContent}>
                    <span className={styles.siteName}>{metadata.siteName}</span>
                    {metadata.title && <span className={styles.title}>{metadata.title}</span>}
                    {metadata.description && <span className={styles.description}>{metadata.description}</span>}
                    <span className={styles.url}>{url}</span>
                </span>
            </span>
        </span>
    );
}
