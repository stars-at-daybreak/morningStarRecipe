import { useSearchParams } from 'react-router-dom';
import MainRank from '../../components/main/Rank';
import Sharing from '../../components/main/Sharing';
import Recent from '../../components/main/Recent';
import SearchPage from '../search/Search';
import SearchForm from '../../components/search/SearchForm';
import { usePageSetup } from '../../hooks/usePageSetup';
import styles from './home.module.css';
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
            <title>모두의 부엌 - 우리집 레시피와 재료 나눔</title>
            <meta
                name='description'
                content='집에서 만드는 맛있는 레시피와 남은 재료를 나누는 커뮤니티. 요리 초보부터 고수까지 모두가 함께하는 부엌 이야기를 시작하세요.'
            />
            <meta name='keywords' content='레시피, 요리, 재료나눔, 음식, 집밥, 요리법, 커뮤니티' />
            {/* Open Graph */}
            <meta property='og:title' content='모두의 부엌 - 우리집 레시피와 재료 나눔' />
            <meta property='og:description' content='집에서 만드는 맛있는 레시피와 남은 재료를 나누는 커뮤니티' />
            <meta property='og:image' content='https://morningstarrecipe.netlify.app/assets/og_logo.png' />
            <meta property='og:type' content='website' />
            <meta property='og:url' content='https://morningstarrecipe.netlify.app/' />

            {/* Twitter */}
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content='모두의 부엌 - 우리집 레시피와 재료 나눔' />
            <meta name='twitter:description' content='집에서 만드는 맛있는 레시피와 남은 재료를 나누는 커뮤니티' />
            <meta name='twitter:image' content='https://morningstarrecipe.netlify.app/assets/og_logo.png' />
            <meta name='twitter:url' content='https://morningstarrecipe.netlify.app/' />
            {/* 추가 SEO */}
            <meta name='robots' content='index, follow' />
            <link rel='canonical' href='https://morningstarrecipe.netlify.app/' />
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
