import HeaderUserProfile from './HeaderUserProfile.tsx';
import { useHeaderStore } from '../stores/useHeaderStore.ts';
const Header = () => {
    const title = useHeaderStore(state => state.title);
    const deviceType = useHeaderStore(state => state.deviceType);
    const showBackButton = useHeaderStore(state => state.showBackButton);

    const isMobile = deviceType === 'mobile';
    const isTablet = deviceType === 'tablet';
    console.log('Header State:', { title, showBackButton, isMobile, isTablet });
    return (
        <header>
            <HeaderUserProfile />
        </header>
    );
};

export default Header;
