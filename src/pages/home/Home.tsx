import { useSearchParams } from 'react-router-dom';
import Rank from '../../components/main/Rank.tsx';
import Sharing from '../../components/main/Sharing.tsx';
import Recent from '../../components/main/Recent.tsx';
import SearchPage from '../search/Search.tsx';
import SearchForm from '../../components/search/SearchForm.tsx';
import { usePageSetup } from '../../hooks/usePageSetup';
import styles from './Home.module.css';
import Recommendation from '../../components/main/Recommendation.tsx';
const Home = () => {
    usePageSetup({
        title: '',
        pageName: 'home',
        showBackButton: false, // 뒤로가기 버튼 표시
    });
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    if (query) {
        return <SearchPage query={query} />;
    }
    return (
        <div className={styles.home}>
            <SearchForm />
            <Recommendation />
            <Rank />
            {/* <Sharing />
            <Recent /> */}
        </div>
    );
};

export default Home;
