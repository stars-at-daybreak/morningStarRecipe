import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearch from '../../hooks/useSearch';
import PostItem from '../../components/postItem/PostItem';

interface SearchPageProps {
    query: string;
}

const SearchPage = ({ query }: SearchPageProps) => {
    const searchConfig = useMemo(() => {
        return {
            pageType: 'all' as const,
            initialParams: { searchTerm: query },
        };
    }, [query]);
    const { searchList, loading, error, updateSearchTerm, updatePostType } = useSearch(searchConfig);
    const navigate = useNavigate();

    return (
        <div style={{ padding: '20px' }}>
            <div>
                <input
                    defaultValue={query}
                    onChange={e => {
                        updateSearchTerm(e.target.value);
                    }}
                    placeholder='검색어 입력'
                    style={{ padding: '8px', marginRight: '10px', width: '200px' }}
                />

                <select
                    onChange={e => {
                        updatePostType(e.target.value as 'all' | 'recipe' | 'share');
                    }}
                    style={{ padding: '8px' }}
                >
                    <option value='all'>전체</option>
                    <option value='recipe'>레시피</option>
                    <option value='share'>나눔</option>
                </select>
            </div>

            <div style={{ marginTop: '20px' }}>
                {loading && <div style={{ color: 'blue' }}>로딩 중...</div>}
                {error && <div style={{ color: 'red' }}>오류: {error}</div>}

                {!loading && searchList.length === 0 && <div style={{ color: 'gray' }}>검색 결과가 없습니다.</div>}

                {searchList.length > 0 && (
                    <div>
                        <h3>검색 결과 ({searchList.length}개)</h3>
                        {/* {searchList.map((item, index) => (
                            <div
                                key={item.id}
                                style={{
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    marginBottom: '4px',
                                }}
                            >
                                {index + 1}. {item.title}
                            </div>
                        ))} */}

                        {searchList.map(item => (
                            <PostItem
                                key={item.id}
                                post={item}
                                type={item.post_type as 'recipe' | 'share'}
                                onClick={postId => {
                                    // 게시물 타입에 따라 다른 경로로 이동
                                    const basePath = item.post_type === 'recipe' ? '/recipes' : '/share';
                                    navigate(`${basePath}/${postId}`);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
