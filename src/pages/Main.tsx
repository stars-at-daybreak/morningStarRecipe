import { Outlet } from 'react-router-dom';
import Footer from '../components/footer/Footer';

const Main = () => {
    return (
        <main>
            <Outlet />
            <Footer />
        </main>
    );
};

export default Main;
