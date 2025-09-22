import { useSearchParams } from 'react-router-dom';
import MainRank from '../../components/main/Rank';
import Sharing from '../../components/main/Sharing';
import Recent from '../../components/main/Recent';
import SearchPage from '../search/Search';
import SearchForm from '../../components/search/SearchForm';
import { usePageSetup } from '../../hooks/usePageSetup';
import styles from './Home.module.css';
import Recommendation from '../../components/main/Recommendation';
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
            <MainRank />
            <a
                className={styles.recommendationLink}
                href='https://weather-menu-recommender.netlify.app/'
                target='_blank'
                rel='noreferrer'
            >
                <div className={styles.recommendationImages}></div>
            </a>
            <Recent />
            <Sharing />
        </div>
    );
};

export default Home;
