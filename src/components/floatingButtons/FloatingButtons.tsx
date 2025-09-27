import { useState, useEffect } from 'react';
import styles from './floatingButtons.module.css';

const FloatingButtons = () => {
    const [fontSizePercent, setFontSizePercent] = useState<number>(62.5);

    // 컴포넌트 마운트 시 sessionStorage에서 폰트 크기 불러오기 (새로고침/재접속 시 초기화)
    useEffect(() => {
        const savedFontSize = sessionStorage.getItem('fontSizePercent');
        if (savedFontSize) {
            const percent = parseFloat(savedFontSize);
            setFontSizePercent(percent);
            document.documentElement.style.fontSize = `${percent}%`;
        } else {
            document.documentElement.style.fontSize = '62.5%';
        }
    }, []);

    // 폰트 크기가 변경될 때마다 sessionStorage에 저장하고 적용
    useEffect(() => {
        sessionStorage.setItem('fontSizePercent', fontSizePercent.toString());
        document.documentElement.style.fontSize = `${fontSizePercent}%`;
    }, [fontSizePercent]);

    // 폰트 크기 증가 (최대 80%)
    const increaseFontSize = () => {
        setFontSizePercent(prev => Math.min(prev + 6.25, 80));
    };

    // 폰트 크기 감소 (최소 50%)
    const decreaseFontSize = () => {
        setFontSizePercent(prev => Math.max(prev - 6.25, 50));
    };

    // 맨 위로 스크롤
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className={styles['floating-buttons']}>
            {/* 폰트 크기 조절 버튼들 */}
            <div className={styles['floating-buttons__font-controls']}>
                <button
                    className={`${styles['floating-buttons__font-btn']} ${styles['floating-buttons__font-btn--increase']}`}
                    onClick={increaseFontSize}
                    title='폰트 크기 증가'
                >
                    {/* 아이콘은 CSS에서 background-image로 처리 */}
                </button>
                <button
                    className={`${styles['floating-buttons__font-btn']} ${styles['floating-buttons__font-btn--decrease']}`}
                    onClick={decreaseFontSize}
                    title='폰트 크기 감소'
                >
                    {/* 아이콘은 CSS에서 background-image로 처리 */}
                </button>
            </div>

            {/* Top 버튼 */}
            <button className={styles['floating-buttons__top-btn']} onClick={scrollToTop} title='맨 위로 가기'>
                {/* 아이콘은 CSS에서 background-image로 처리 */}
            </button>
        </div>
    );
};

export default FloatingButtons;
