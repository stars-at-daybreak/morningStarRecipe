import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/header/Header.tsx';
import Main from '../Main.tsx';
import Footer from '../../components/footer/Footer.tsx';
import Nav from '../../components/nav/Nav.tsx';
import styles from './Layout.module.css';
import FloatingButtons from '../../components/FloatingButtons/FloatingButtons.tsx';

const Layout = () => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const location = useLocation();

    // 푸터를 숨길 페이지들만 정의 (EmptyState가 사용되는 페이지들 추가)
    const hideFooterPaths = ['/404', ];

    // 현재 경로가 푸터를 숨길 페이지인지 확인
    const shouldHideFooter = hideFooterPaths.includes(location.pathname);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div className={isDesktop ? styles.header_desktop : ''}>
                <Header />
            </div>
            <Nav />
            <div className={isDesktop ? styles.main_desktop : ''}>
                <Main />
            </div>
            {!shouldHideFooter && (
                <div className={isDesktop ? styles.footer_desktop : ''}>
                    <Footer />
                </div>
            )}
            <FloatingButtons />
        </>
    );
};

export default Layout;
