import { NavLink, useNavigate } from 'react-router-dom';
import useSearch from '../../hooks/useSearch.tsx';
import type { ShareStatus } from '../../types/search.types.ts';
import PostItem from '../../components/postItem/PostItem.tsx';

const Share = ({ query }: { query?: string }) => {
    const navigate = useNavigate();
    const { searchList, loading, updateSearchTerm, updateShareStatus } = useSearch({
        pageType: 'share',
        initialParams: {
            searchTerm: query,
        },
    });

    const handleFilter = (filter: ShareStatus) => {
        updateShareStatus(filter);
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
            {loading ? (
                <div>로딩 중...</div>
            ) : (
                <>
                    {searchList.map(item => (
                        <PostItem
                            key={item.id}
                            post={item}
                            type='share'
                            onClick={postId => navigate(`/share/${postId}`)}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default Share;
