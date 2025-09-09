import useSearch from '../../hooks/useSearch';

interface SearchPageProps {
    query: string;
}

const SearchPage = ({ query }: SearchPageProps) => {
    const { searchList, loading, updateSearchTerm, updatePostType } = useSearch({
        pageType: 'all',
        initialParams: {
            searchTerm: query, // 초기값으로 설정
        },
    });

    return (
        <div>
            <input
                defaultValue={query} // 초기값 표시
                onChange={e => updateSearchTerm(e.target.value)}
            />

            <select onChange={e => updatePostType(e.target.value as 'all' | 'recipe' | 'share')}>
                <option value='all'>전체</option>
                <option value='recipe'>레시피</option>
                <option value='share'>나눔</option>
            </select>

            {loading && <div>로딩 중...</div>}

            {searchList.map(item => (
                <div key={item.id}>{item.title}</div>
            ))}
        </div>
    );
};

export default SearchPage;
