import { Link } from 'react-router-dom';
import useUserStore from '../../stores/useUserStore.ts';
import Rank from '../../components/Main/Rank.tsx';
import Recent from '../../components/Main/Recent.tsx';

const Home = () => {
    const { user } = useUserStore();

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
            {user && (
                <ul>
                    <>
                        <li>
                            <Link to={'/mypage'}>마이페이지</Link>
                        </li>
                    </>
                </ul>
            )}
            <Rank />
            <Recent />
        </>
    );
};

export default Home;
