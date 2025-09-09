import { NavLink } from 'react-router-dom';
import useSearch from '../../hooks/useSearch.tsx';
import type { RecipeSortBy } from '../../types/search.types.ts';

const Recipes = ({ query }: { query?: string }) => {
    const { searchList, loading, updateSearchTerm, updateRecipeSortBy } = useSearch({
        pageType: 'recipe',
        initialParams: {
            searchTerm: query,
        },
    });

    const handleFIlter = (filter: RecipeSortBy) => {
        updateRecipeSortBy(filter);
    };

    return (
        <div>
            <NavLink to='/recipes/form'>레시피 등록하기</NavLink>
            <button onClick={() => handleFIlter('recently')}>최신순</button>
            <button onClick={() => handleFIlter('recommended')}>추천순</button>
            <button onClick={() => handleFIlter('popular')}>인기순</button>
            <div>
                <label htmlFor='search'>검색어</label>
                <input id='search' defaultValue={query} onChange={e => updateSearchTerm(e.target.value)} />
            </div>

            {loading ? <div>로딩 중...</div> : searchList.map(item => <div key={item.id}>{item.title}</div>)}
        </div>
    );
};

export default Recipes;
