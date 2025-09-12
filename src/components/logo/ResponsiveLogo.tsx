import loginLogoTablet from '../../assets/login_logo_tablet.svg';
import loginLogoMobile from '../../assets/login_logo_mobile.svg';

const ResponsiveLogo = () => {
    return (
        <picture>
            <source media='(min-width: 1024px)' srcSet={loginLogoTablet} />
            <img src={loginLogoMobile} alt='모두의 부엌 로고' />
        </picture>
    );
};

export default ResponsiveLogo;
