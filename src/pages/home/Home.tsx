import { Link, useSearchParams } from 'react-router-dom';
import useUserStore from '../../stores/useUserStore.ts';
import Rank from '../../components/Main/Rank.tsx';
import Sharing from '../../components/Main/Sharing.tsx';
import Recent from '../../components/Main/Recent.tsx';
import SearchPage from '../search/Search.tsx';
import PasswordFind from '../../components/PasswordFind.tsx';
import SearchForm from '../../components/SearchForm.tsx';
import Recipes from '../recipes/Recipes.tsx';

const Home = () => {
    const { user } = useUserStore();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    if (query) {
        return <SearchPage query={query} />;
    }
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
                        <li>
                            <PasswordFind />
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
            <SearchForm />
            <Rank />
            <Sharing />
            <Recent />
            <Recipes />
        </>
    );
};

export default Home;
