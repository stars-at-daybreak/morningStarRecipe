import { NavLink, useNavigate } from 'react-router-dom';
import useSearch from '../../hooks/useSearch.tsx';
import type { RecipeSortBy } from '../../types/search.types.ts';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { fetchCategories } from '../../services/supabaseCategories.ts';
import type { Tables } from '../../types/supabase.ts';
import { usePageSetup } from '../../hooks/usePageSetup.tsx';
import SearchInput from '../../components/search/SearchFromList';
import { useModal } from '../../components/modal/ModalContext';
import styles from './recipes.module.css';
import useUserStore from '../../stores/useUserStore.ts';
import PostItem from '../../components/postItem/PostItem';
import EmptyState from '../../components/EmptyState/EmptyState';
import { SyncLoader } from 'react-spinners';
// ------------------- 디바운스 훅 -------------------
function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

const Recipes = () => {
    const query = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get('query') || '';
    }, [location.search]);
    const [categories, setCategories] = useState<Tables<'categories'>[]>([]);
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { openModal } = useModal();

    const getCategories = async () => {
        const data = await fetchCategories();
        setCategories(data);
    };
    usePageSetup({
        title: '모두의 레시피',
        pageName: 'recipes',
        showBackButton: true,
    });

    useEffect(() => {
        getCategories();
    }, []);

    const [inputValue, setInputValue] = useState(query);
    const debouncedInput = useDebounce(inputValue, 500);

    //search, List
    const observerRef = useRef<HTMLDivElement>(null);
    // ------------------- useSearch 설정 -------------------
    const searchConfig = useMemo(
        () => ({
            pageType: 'recipe' as const,
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
        error,
        totalCount,
        isInitialized,
        hasMore,
        loadMore,
        updateRecipeSortBy,
        currentRecipeCategory,
        currentRecipeSort,
        updateCategory,
        updateSearchTerm,
        search,
        initialize,
    } = useSearch(searchConfig);
    const searchRef = useRef(search);
    // 초기 검색
    useEffect(() => {
        if (isInitialized) {
            searchRef.current({ searchTerm: debouncedInput.toString() });
        } else {
            setTimeout(() => {
                search();
            }, 1000);
        }
    }, [debouncedInput, isInitialized]);
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [target] = entries;
            if (target.isIntersecting && hasMore && !loadingMore) {
                loadMore();
            }
        },
        [hasMore, loadingMore, loadMore, searchList.length, totalCount]
    );

    useEffect(() => {
        const element = observerRef.current;
        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(handleObserver, {
            threshold: 0.1,
            rootMargin: '100px',
        });

        observer.observe(element);
        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [handleObserver]);

    // 카테고리 클릭 핸들러
    const handleCategoryClick = useCallback(
        (categoryId: string) => {
            updateCategory(categoryId); // 카테고리 상태 업데이트
            search({
                // 검색 다시 실행
                searchTerm: debouncedInput,
                category: categoryId,
                sortBy: currentRecipeSort,
            });
        },
        [debouncedInput, currentRecipeSort, search, updateCategory]
    );

    // 정렬 클릭 핸들러
    const handleSortClick = useCallback(
        (sort: RecipeSortBy) => {
            updateRecipeSortBy(sort); // 정렬 상태 업데이트
            search({
                // 검색 다시 실행
                searchTerm: debouncedInput,
                category: currentRecipeCategory,
                sortBy: sort,
            });
        },
        [debouncedInput, currentRecipeCategory, search, updateRecipeSortBy]
    );
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
    return (
        <div className={styles['recipe']}>
            <section className={styles['recipe__category']}>
                <h2 className='sr-only'>카테고리</h2>
                <div className={styles['recipe__category-border']}>
                    <ul>
                        <li
                            className={
                                currentRecipeCategory === ''
                                    ? styles['recipe__categoryBtn-active']
                                    : styles['recipe__categoryBtn']
                            }
                        >
                            <button
                                className={styles['recipe__category-button']}
                                type='button'
                                onClick={() => handleCategoryClick('')}
                            >
                                전체
                            </button>
                        </li>
                        {categories.map(data => (
                            <li
                                key={data.id}
                                className={
                                    currentRecipeCategory === data.id
                                        ? styles['recipe__categoryBtn-active']
                                        : styles['recipe__categoryBtn']
                                }
                            >
                                <button
                                    className={styles['recipe__category-button']}
                                    type='button'
                                    onClick={() => handleCategoryClick(data.id)}
                                >
                                    {data.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className={styles['recipe__contents-box']}>
                <div className={styles['recipe__search']}>
                    <SearchInput
                        value={inputValue || ''}
                        placeholder='오늘의 메뉴를 검색하세요'
                        onChange={val => {
                            setInputValue(val);
                            updateSearchTerm(val);
                        }}
                    />
                </div>

                <div className={styles['recipe__button-box']}>
                    <ul className={styles['recipe__order']}>
                        <li
                            className={
                                currentRecipeSort == 'recently'
                                    ? styles['recipe__orderBtn-active']
                                    : styles['recipe__orderBtn']
                            }
                        >
                            <button type='button' onClick={() => handleSortClick('recently')}>
                                최신순
                            </button>
                        </li>
                        <li
                            className={
                                currentRecipeSort == 'recommended'
                                    ? styles['recipe__orderBtn-active']
                                    : styles['recipe__orderBtn']
                            }
                        >
                            <button type='button' onClick={() => handleSortClick('recommended')}>
                                추천순
                            </button>
                        </li>
                        <li
                            className={
                                currentRecipeSort == 'popular'
                                    ? styles['recipe__orderBtn-active']
                                    : styles['recipe__orderBtn']
                            }
                        >
                            <button type='button' onClick={() => handleSortClick('popular')}>
                                인기순
                            </button>
                        </li>
                    </ul>

                    {user ? (
                        <NavLink className={styles['recipe__write-btn']} to='/recipes/form'>
                            레시피 작성
                        </NavLink>
                    ) : (
                        <button
                            className={styles['recipe__write-btn']}
                            type='button'
                            onClick={() => openModal('LOGIN')}
                        >
                            레시피 작성
                        </button>
                    )}
                </div>
                <section className={styles.recipe__results} aria-live='polite'>
                    <h2 className='sr-only'>나눔 게시글 목록 (총 {totalCount}개)</h2>

                    {!isInitialized ? (
                        <div className={styles.recipe__loading}>
                            {' '}
                            <SyncLoader color='var(--color-green)' size={spinnerSize} margin={2} />
                        </div>
                    ) : (
                        <>
                            {/* 검색 결과 없음 */}
                            {!loading && searchList.length === 0 && (
                                <div className={styles.recipe__noneresults}>
                                    <h2 className='sr-only'>검색 결과가 없습니다</h2>
                                    <EmptyState title='아직 아무것도 없어요' />
                                </div>
                            )}

                            {/* 게시글 리스트 */}
                            {searchList.map((item, index) => (
                                <div key={`${item.id}-${index}`}>
                                    <PostItem
                                        post={item}
                                        type='recipe'
                                        onClick={postId => navigate(`/recipes/${postId}`)}
                                    />
                                </div>
                            ))}
                            {/* 무한스크롤 트리거 영역 - 시각화 */}
                            {!loading && hasMore && !loadingMore && searchList.length > 0 && (
                                <div ref={observerRef} aria-hidden='true'>
                                    <span></span>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </section>
        </div>
    );
};

export default Recipes;
