import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearch from '../../hooks/useSearch';
import PostItem from '../../components/postItem/PostItem';
import SearchInput from '../../components/search/SearchFromList';
import styles from './SearchPage.module.css';
import EmptyState from '../../components/EmptyState/EmptyState';
import { SyncLoader } from 'react-spinners';

interface SearchPageProps {
    query: string;
}

// ------------------- 한글 조합을 고려한 디바운스 훅 -------------------
function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return [debouncedValue] as const;
}

const SearchPage = ({ query }: SearchPageProps) => {
    // 검색 입력 상태
    const [inputValue, setInputValue] = useState(query);
    const [debouncedInput] = useDebounce(inputValue, 500);
    // 스피너 반응형으로 크기 적용
    const [spinnerSize, setSpinnerSize] = useState(8);

    useEffect(() => {
        const updateSpinnerSize = () => {
            if (window.innerWidth >= 768) {
                setSpinnerSize(12); // 태블릿
            } else {
                setSpinnerSize(8); // 모바일
            }
        };

        updateSpinnerSize();
        window.addEventListener('resize', updateSpinnerSize);
        return () => window.removeEventListener('resize', updateSpinnerSize);
    }, []);

    // ------------------- useSearch 설정 -------------------
    const searchConfig = useMemo(
        () => ({
            pageType: 'all' as const,
            initialParams: { searchTerm: query },
            enableInfiniteScroll: true,
            pageSize: 5,
        }),
        [query]
    );

    const {
        searchList,
        loading,
        loadingMore,
        updateSearchParams,
        totalCount,
        hasMore,
        loadMore,
        searchParams, // 새롭게 추가
        currentPostType, // state에서 직접 가져오기
    } = useSearch(searchConfig);
    // ------------------- 무한 스크롤 -------------------
    const observerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // IntersectionObserver 설정
    useEffect(() => {
        const element = observerRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            entries => {
                const [target] = entries;
                if (target.isIntersecting) {
                    if (hasMore && !loadingMore && !loading) {
                        loadMore();
                    }
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px',
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [hasMore, loadingMore, loading, loadMore]);

    // ------------------- 디바운스된 검색 실행 -------------------
    useEffect(() => {
        if (searchParams.searchTerm !== debouncedInput.toString()) {
            updateSearchParams({ searchTerm: debouncedInput.toString() });
        }
    }, [debouncedInput, updateSearchParams, searchParams.searchTerm]);

    // ------------------- 필터 변경 -------------------
    const handlePostTypeChange = useCallback(
        (value: 'all' | 'recipe' | 'share') => {
            updateSearchParams({ postType: value });
        },
        [updateSearchParams]
    );

    // ------------------- 검색 입력 핸들러 -------------------
    const handleInputChange = useCallback((val: string) => {
        setInputValue(val);
    }, []);

    // ------------------- 네비게이션 핸들러 -------------------
    const handlePostClick = useCallback(
        (postId: string, postType: string) => {
            const basePath = postType === 'recipe' ? '/recipes' : '/share';
            navigate(`${basePath}/${postId}`);
        },
        [navigate]
    );

    // ------------------- 필터 옵션 메모이제이션 -------------------
    const filterOptions = useMemo(
        () => [
            { value: 'all' as const, label: '전체' },
            { value: 'recipe' as const, label: '레시피' },
            { value: 'share' as const, label: '나눔' },
        ],
        []
    );

    // ------------------- 렌더링 상태 계산 -------------------
    const showNoResults = !loading && searchList.length === 0;
    const showResults = searchList.length > 0;
    const showLoadingMoreSpinner = loadingMore;
    return (
        <>
            <title>레시피 검색 - 모두의 부엌</title>
            <meta
                name='description'
                content='원하는 레시피를 검색해보세요. 재료, 요리명, 카테고리로 다양한 레시피를 찾을 수 있습니다.'
            />
            <meta name='keywords' content='레시피 검색, 요리 검색, 재료 검색, 음식 찾기, 요리법 검색' />
            <meta property='og:title' content='레시피 검색 - 모두의 부엌' />
            <meta
                property='og:description'
                content='원하는 레시피를 검색해보세요. 재료, 요리명, 카테고리로 다양한 레시피를 찾을 수 있습니다.'
            />
            <meta property='og:image' content='https://morningstarrecipe.netlify.app/assets/og_image.png' />
            <meta property='og:type' content='website' />
            <meta property='og:url' content='https://morningstarrecipe.netlify.app/?query=' />
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content='레시피 검색 - 모두의 부엌' />
            <meta
                name='twitter:description'
                content='원하는 레시피를 검색해보세요. 재료, 요리명, 카테고리로 다양한 레시피를 찾을 수 있습니다.'
            />
            <meta name='twitter:image' content='https://morningstarrecipe.netlify.app/assets/og_image.png' />
            <meta name='robots' content='noindex, follow' />
            <link rel='canonical' href='https://morningstarrecipe.netlify.app/?query=' />

            <main className={styles.searchPage}>
                <header className={styles.searchPage__header}>
                    <div className={styles.searchPage__inputWrapper}>
                        <SearchInput value={inputValue || ''} onChange={handleInputChange} />
                    </div>

                    <h2 className={styles.searchPage__resultsTitle}>
                        <strong>{inputValue}</strong> 검색 결과 총 <strong>{totalCount}건</strong> 입니다.
                    </h2>

                    <nav className={styles.searchPage__filter} role='tablist' aria-label='게시물 타입 필터'>
                        {filterOptions.map(option => (
                            <button
                                key={option.value}
                                role='tab'
                                aria-selected={currentPostType === option.value}
                                className={`${styles.searchPage__filterOption} ${
                                    currentPostType === option.value ? styles.searchPage__filterOption_active : ''
                                }`}
                                onClick={() => handlePostTypeChange(option.value)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </nav>

                    <div className={styles.searchPage__divider}></div>
                </header>

                <section className={styles.searchPage__results} aria-live='polite'>
                    {loading ? (
                        <div className={styles.searchPage__loading}>
                            {/* <SyncLoader color='var(--color-green)' size={spinnerSize} margin={2} /> */}
                        </div>
                    ) : (
                        <>
                            {showNoResults && (
                                <div className={styles.searchPage__noResults}>
                                    <h2 className='sr-only'>검색 결과가 없습니다</h2>
                                    <EmptyState title='아직 아무것도 없어요' />
                                </div>
                            )}

                            {showResults && (
                                <div className={styles.searchPage__resultsContainer}>
                                    <ul className={styles.searchPage__resultsList}>
                                        {searchList.map((item, index) => (
                                            <li key={`${item.id}-${index}`} className={styles.searchPage__resultsItem}>
                                                <PostItem
                                                    post={item}
                                                    type={item.post_type as 'recipe' | 'share'}
                                                    onClick={postId => handlePostClick(postId, item.post_type || 'all')}
                                                />
                                            </li>
                                        ))}
                                    </ul>

                                    {showLoadingMoreSpinner && (
                                        <div className={styles.searchPage__loadingMore}>
                                            <SyncLoader color='var(--color-green)' size={spinnerSize} margin={2} />
                                        </div>
                                    )}

                                    {hasMore && !showLoadingMoreSpinner && (
                                        <div
                                            ref={observerRef}
                                            className={styles.searchPage__loadTrigger}
                                            aria-hidden='true'
                                        >
                                            <span style={{ display: 'block', height: '20px', width: '100%' }}></span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>
        </>
    );
};

export default SearchPage;
