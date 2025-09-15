import { NavLink, useNavigate } from 'react-router-dom';
import useSearch from '../../hooks/useSearch.tsx';
import type { ShareStatus } from '../../types/search.types.ts';
import { getRecipesWithPagination } from '../../services/supabasePosts';
import InfinitePostList from '../../components/infiniteScroll/InfiniteScroll.tsx';

const Share = ({ query }: { query?: string }) => {
    const navigate = useNavigate();
    const { updateSearchTerm, updateShareStatus } = useSearch({
        pageType: 'share',
        initialParams: {
            searchTerm: query,
        },
    });

    const handleFilter = (filter: ShareStatus) => {
        updateShareStatus(filter);
    };

    const handlePostClick = (postId: string) => {
        navigate(`/recipes/${postId}`);
    };

    return (
        <div>
            <h2>~~~~~~~~~~~~~~나눔 목록~~~~~~~~~~~~~~</h2>
            <NavLink to='/share/form'>나눔 등록하기</NavLink>
            <button onClick={() => handleFilter('available')}>나눔중</button>
            <button onClick={() => handleFilter('reserved')}>예약중</button>
            <button onClick={() => handleFilter('completed')}>완료</button>
            <div>
                <label htmlFor='search'>검색어</label>
                <input id='search' defaultValue={query} onChange={e => updateSearchTerm(e.target.value)} />
            </div>
            <InfinitePostList type='share' fetchFunction={getRecipesWithPagination} onPostClick={handlePostClick} />
        </div>
    );
};

export default Share;
