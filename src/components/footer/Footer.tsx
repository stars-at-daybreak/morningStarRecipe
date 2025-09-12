import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            {/* 상단 링크 영역 */}
            <div className={styles.footer__container}>
                <div className={styles.footer__links}>
                    <Link to='/privacy' className='footer-link'>
                        개인정보처리방침
                    </Link>
                    <span className={styles.footer__bar}></span>
                    <Link to='/terms' className={styles['footer-link']}>
                        서비스이용약관
                    </Link>
                </div>
                <p className={styles.footer__copyright}>© 2025 ourkitchen. All rights reserved.</p>
            </div>

            {/* GitHub 버튼 */}
            <div className={styles.footer__github__section}>
                <a
                    href='https://github.com/stars-at-daybreak/morningStarRecipe.git'
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.footer__github__button}
                ></a>
            </div>
        </footer>
    );
};

export default Footer;
