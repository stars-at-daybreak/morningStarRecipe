import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';

const Home = () => {
    const { user } = useAuth();
    console.log('user', user);

    return (
        <>
            {!user && (
                <ul>
                    <>
                        <li>
                            <Link to={'/login'}>로그인</Link>
                        </li>
                        <li>
                            <Link to={'/signup'}>회원가입</Link>
                        </li>
                    </>
                </ul>
            )}
        </>
    );
};

export default Home;
