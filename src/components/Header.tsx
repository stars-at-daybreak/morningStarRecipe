import HeaderUserProfile from './HeaderUserProfile.tsx';
import { usePageStore } from '../stores/usePageStore';
const Header = () => {
    const { title, showBackButton } = usePageStore();
    return (
        <header className='header'>
            {showBackButton && <button onClick={() => window.history.back()}>← 뒤로</button>}
            <h1>{title}</h1>
            <HeaderUserProfile />
        </header>
    );
};

export default Header;
