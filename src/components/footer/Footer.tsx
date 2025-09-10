import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            {/* 상단 링크 영역 */}
            <div className={styles.container}>
                <div className={styles['footer-links']}>
                    <Link to='/privacy' className='footer-link'>
                        개인정보처리방침
                    </Link>
                    <span className={styles.bar}></span>
                    <Link to='/terms' className={styles['footer-link']}>
                        서비스이용약관
                    </Link>
                </div>
                <p className={styles.copyright}>© 2025 ourkitchen. All rights reserved.</p>
            </div>

            {/* GitHub 버튼 */}
            <div className={styles['github-section']}>
                <a
                    href='https://github.com/stars-at-daybreak/morningStarRecipe.git' // 실제 GitHub 주소로 변경해주세요
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles['github-button']}
                ></a>
            </div>
        </footer>
    );
};

export default Footer;
