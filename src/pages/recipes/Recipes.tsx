import { Link, NavLink } from 'react-router-dom';
import useSearch from '../../hooks/useSearch.tsx';
import type { RecipeSortBy } from '../../types/search.types.ts';

const Recipes = ({ query }: { query?: string }) => {
    const { searchList, loading, updateSearchTerm, updateRecipeSortBy } = useSearch({
        pageType: 'recipe',
        initialParams: {
            searchTerm: query,
        },
    });

    const handleFilter = (filter: RecipeSortBy) => {
        updateRecipeSortBy(filter);
    };

    return (
        <div>
            <h2>~~~~~~~~~~~~~~레시피 목록~~~~~~~~~~~~~~</h2>
            <NavLink to='/recipes/form'>레시피 등록하기</NavLink>
            <button onClick={() => handleFilter('recently')}>최신순</button>
            <button onClick={() => handleFilter('recommended')}>추천순</button>
            <button onClick={() => handleFilter('popular')}>인기순</button>
            <div>
                <label htmlFor='search'>검색어</label>
                <input id='search' defaultValue={query} onChange={e => updateSearchTerm(e.target.value)} />
            </div>
            {loading ? (
                <div>로딩 중...</div>
            ) : (
                <>
                    <ul>
                        {searchList.map(item => (
                            <li key={item.id}>
                                <Link to={`/recipes/${item.id}`}>{item.title}</Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Recipes;
