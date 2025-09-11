import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header.tsx';
import Main from '../Main.tsx';
import Footer from '../../components/footer/Footer.tsx';
import Nav from '../../components/nav/Nav.tsx';
import styles from './Layout.module.css';

const Layout = () => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

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
            <div className={isDesktop ? styles.footer_desktop : ''}>
                <Footer />
            </div>
        </>
    );
};

export default Layout;
