import { Link } from 'react-router-dom';
import { usePageStore } from '../../stores/usePageStore';
import logo from '../../assets/logo.svg';
import prev from '../../assets/prev_icon.png';
import styles from './Header.module.css';
import { useModal } from '../../components/modal/ModalContext';
const Header = () => {
    const { title, pageName, showBackButton } = usePageStore();
    const specialPages = ['shareUpdate', 'shareWrite', 'recipeWrite', 'recipeUpdate'];
    const { openModal } = useModal();
    const handleBackNavigation = () => {
        if (specialPages.includes(pageName)) {
            openModal('CONFIRM_DISCARD_POST', async () => {
                window.history.back();
            });
        } else {
            window.history.back();
        }
    };

    return (
        <header className={styles.header} role='banner'>
            <nav className={styles.header__nav} role='navigation' aria-label='페이지 내비게이션'>
                {showBackButton && (
                    <button
                        type='button'
                        onClick={handleBackNavigation}
                        className={styles.header__backButton}
                        aria-label='이전 페이지로 돌아가기'
                    >
                        <span aria-hidden='true'>
                            <img src={prev} alt='뒤로' className={styles.header__prevIcon} />
                        </span>
                    </button>
                )}
            </nav>

            {title ? (
                <h1 className={styles.header__title}>{title}</h1>
            ) : (
                <Link to='/' className={styles.header__homeLink} aria-label='홈으로 이동'>
                    <h1 className={styles.header__logoWrapper}>
                        <img src={logo} alt='사이트 로고' className={styles.header__logo} />
                    </h1>
                </Link>
            )}
        </header>
    );
};

export default Header;
