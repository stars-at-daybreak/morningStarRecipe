import { useState, useEffect } from 'react';
import styles from './nav.module.css';
import { usePageStore } from '../../stores/usePageStore';
import homeIcon from '../../assets/home_icon.svg';
import homeActIcon from '../../assets/home_icon_active.svg';
import bookIcon from '../../assets/book_icon.svg';
import bookActIcon from '../../assets/book_icon_active.svg';
import heartIcon from '../../assets/heart_icon.svg';
import heartActIcon from '../../assets/heart_icon_active.svg';
import userIcon from '../../assets/user_icon.svg';
import userActIcon from '../../assets/user_icon_active.svg';
import face from '../../assets/face.svg';
import { Link } from 'react-router-dom';
import { useModal } from '../modal/ModalContext';
import useUserStore from '../../stores/useUserStore';
interface NavItem {
    href: string; // 링크 주소 (예: '/', '/recipes')
    label: string; // 표시될 텍스트 (예: 'Home', '모두의 레시피')
    titleMatch: string; // 매칭할 페이지 타이틀 (예: 'Home', '모두의 레시피')
    icon: string; // 일반 상태 아이콘 경로
    activeIcon: string; // 활성 상태 아이콘 경로
}
const Nav = () => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const { title } = usePageStore();
    const { user } = useUserStore();
    const { openModal } = useModal();

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        {
            href: '/',
            label: '홈',
            titleMatch: '', // 또는 메인 페이지의 title 값
            icon: homeIcon,
            activeIcon: homeActIcon,
        },
        {
            href: '/recipes',
            label: '모두의 레시피',
            titleMatch: '모두의 레시피', // 레시피 페이지의 title 값
            icon: bookIcon,
            activeIcon: bookActIcon,
        },
        {
            href: '/share',
            label: '모두의 나눔',
            titleMatch: '모두의 나눔', // 나눔 페이지의 title 값
            icon: heartIcon,
            activeIcon: heartActIcon,
        },
        {
            href: '/mypage',
            label: '마이페이지',
            titleMatch: '마이페이지', // 마이페이지의 title 값
            icon: userIcon,
            activeIcon: userActIcon,
        },
    ];

    const isActive = (item: NavItem): boolean => {
        return title === item.titleMatch;
    };

    const navContent = (
        <nav className={styles.nav}>
            <ul className={styles.nav__list}>
                {isDesktop ? (
                    <li className={styles.nav__item}>
                        <Link to={'/'} className={`${styles.nav__link} ${styles.nav__link_logo}`}>
                            <img src={face} className={styles.nav__icon} alt='Logo icon' />
                        </Link>
                    </li>
                ) : null}
                {navItems.map(item => (
                    <li
                        key={item.href}
                        className={`${styles.nav__item} ${isActive(item) ? styles.nav__item_active : ''}`}
                    >
                        <Link
                            to={item.href === '/mypage' && !user ? '#' : item.href}
                            onClick={
                                item.href === '/mypage' && !user
                                    ? e => {
                                          e.preventDefault();
                                          openModal('LOGIN');
                                      }
                                    : undefined
                            }
                            className={`${styles.nav__link} ${isActive(item) ? styles.nav__link_active : ''}`}
                        >
                            <img
                                src={isActive(item) ? item.activeIcon : item.icon}
                                className={styles.nav__icon}
                                alt={`${item.label} icon`}
                            />
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );

    return <>{isDesktop ? <aside>{navContent}</aside> : navContent}</>;
};

export default Nav;
