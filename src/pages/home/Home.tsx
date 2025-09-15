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
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    usePageSetup({
        title: query ? '검색' : '',
        pageName: query ? 'search' : 'home',
        showBackButton: query ? true : false,
    });
    if (query) {
        return <SearchPage query={query} />;
    }
    return (
        <div className={styles.home}>
            <SearchForm />
            <Recommendation />
            <Rank />
            <a
                className={styles.recommendationLink}
                href='https://weather-menu-recommender.netlify.app/'
                target='_blank'
                rel='noreferrer'
            >
                <div className={styles.recommendationImages}></div>
            </a>
            <Sharing />
            <Recent />
        </div>
    );
};

export default Home;
