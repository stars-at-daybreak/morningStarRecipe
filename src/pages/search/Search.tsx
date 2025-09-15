import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearch from '../../hooks/useSearch';
import PostItem from '../../components/postItem/PostItem';
import SearchInput from '../../components/search/SearchFromList';
import styles from './SearchPage.module.css';

interface SearchPageProps {
    query: string;
}

const SearchPage = ({ query }: SearchPageProps) => {
    const [currentPostType, setCurrentPostType] = useState<'all' | 'recipe' | 'share'>('all');
    const [inputValue, setInputValue] = useState(query);

    const searchConfig = useMemo(() => {
        return {
            pageType: 'all' as const,
            initialParams: { searchTerm: query },
        };
    }, [query]);

    const { searchList, loading, error, updateSearchTerm, updatePostType } = useSearch(searchConfig);
    const navigate = useNavigate();

    const updateQuery = (query: string) => {
        if (query) navigate(`/?query=${query}`);
    };

    const handlePostTypeChange = (value: 'all' | 'recipe' | 'share') => {
        setCurrentPostType(value);
        updatePostType(value);
    };

    return (
        <main className={styles.searchPage}>
            <header className={styles.searchPage__header}>
                <div className={styles.searchPage__inputWrapper}>
                    <SearchInput
                        value={inputValue || ''}
                        onChange={val => {
                            setInputValue(val);
                            updateSearchTerm(val);
                            updateQuery(val);
                        }}
                    />
                </div>
                <h2 className={styles.searchPage__resultsTitle}>
                    <strong>{inputValue}</strong> 검색 결과 총<strong>{searchList.length}건</strong> 입니다.
                </h2>
                <nav className={styles.searchPage__filter} role='tablist' aria-label='게시물 타입 필터'>
                    {[
                        { value: 'all', label: '전체' },
                        { value: 'recipe', label: '레시피' },
                        { value: 'share', label: '나눔' },
                    ].map(option => (
                        <button
                            key={option.value}
                            role='tab'
                            aria-selected={currentPostType === option.value}
                            className={`${styles.searchPage__filterOption} ${
                                currentPostType === option.value ? styles.searchPage__filterOption_active : ''
                            }`}
                            onClick={() => handlePostTypeChange(option.value as 'all' | 'recipe' | 'share')}
                        >
                            {option.label}
                        </button>
                    ))}
                </nav>
            </header>

            <section className={styles.searchPage__results} aria-live='polite'>
                {!loading && searchList.length === 0 && (
                    <div className={styles.searchPage__noResults}>검색 결과가 없습니다.</div>
                )}

                {searchList.length > 0 && (
                    <div className={styles.searchPage__resultsContainer}>
                        <ul className={styles.searchPage__resultsList}>
                            {searchList.map(item => (
                                <li key={item.id} className={styles.searchPage__resultsItem}>
                                    <PostItem
                                        post={item}
                                        type={item.post_type as 'recipe' | 'share'}
                                        onClick={postId => {
                                            const basePath = item.post_type === 'recipe' ? '/recipes' : '/share';
                                            navigate(`${basePath}/${postId}`);
                                        }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </main>
    );
};

export default SearchPage;
