import Header from '../components/header/Header.tsx';
import Main from './Main.tsx';
import Footer from '../components/footer/Footer';
import Nav from '../components/nav/Nav';
const Layout = () => {
    return (
        <>
            <Header />
            <Nav />
            <Main />
            <Footer />
        </>
    );
};

export default Layout;
