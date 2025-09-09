import { NavLink } from 'react-router-dom';
import useSearch from '../../hooks/useSearch.tsx';

const Recipes = ({ query }: { query?: string }) => {
    const { searchList, loading, updateSearchTerm } = useSearch({
        pageType: 'recipe',
        initialParams: {
            searchTerm: query,
        },
    });

    return (
        <div>
            <NavLink to='/recipes/form'>레시피 등록하기</NavLink>

            <div>
                <label htmlFor='search'>검색어</label>
                <input id='search' defaultValue={query} onChange={e => updateSearchTerm(e.target.value)} />
            </div>

            {loading ? <div>로딩 중...</div> : searchList.map(item => <div key={item.id}>{item.title}</div>)}
        </div>
    );
};

export default Recipes;
