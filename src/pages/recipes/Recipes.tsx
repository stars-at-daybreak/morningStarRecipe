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

const Recipes = ({ query }: { query?: string }) => {
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
        showBackButton: false,
    });

    useEffect(() => {
        getCategories();
    }, []);

    const [inputValue, setInputValue] = useState(query);
    const updateQuery = (query: string) => {
        if (query) navigate(`/recipes?query=${query}`);
    };
    //search, List
    const observerRef = useRef<HTMLDivElement>(null);
    const searchConfig = useMemo(() => {
        return {
            pageType: 'recipe' as const,
            initialParams: { searchTerm: query },
            enableInfiniteScroll: true,
            pageSize: 5,
        };
    }, [query]);

    const {
        searchList,
        loadingMore,
        updateSearchTerm,
        totalCount,
        currentRecipeCategory,
        currentRecipeSort,
        updateCategory,
        updateRecipeSortBy,
        hasMore,
        loadMore,
    } = useSearch(searchConfig);
    console.log(currentRecipeSort);
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
    const handleFilter = (status: RecipeSortBy) => {
        updateRecipeSortBy(status);
    };
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
                                onClick={() => updateCategory('')}
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
                                    onClick={() => updateCategory(data.id)}
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
                            updateQuery(val);
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
                            <button type='button' onClick={() => handleFilter('recently')}>
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
                            <button type='button' onClick={() => handleFilter('recommended')}>
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
                            <button type='button' onClick={() => handleFilter('popular')}>
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
                <section className={styles.sharePage__results} aria-live='polite'>
                    <h2 className='sr-only'>나눔 게시글 목록 (총 {totalCount}개)</h2>
                    {/* 검색 결과 없음 */}
                    {searchList.length === 0 && (
                        <div className={styles.sharePage__noneresults}>
                            <h2 className='sr-only'>검색 결과가 없습니다</h2>
                            <EmptyState title='아직 아무것도 없어요' />
                        </div>
                    )}

                    {/* 게시글 리스트 */}
                    {searchList.map((item, index) => (
                        <div key={`${item.id}-${index}`}>
                            <PostItem post={item} type='recipe' onClick={postId => navigate(`/recipes/${postId}`)} />
                        </div>
                    ))}
                    {/* 무한스크롤 트리거 영역 - 시각화 */}
                    {hasMore && !loadingMore && searchList.length > 0 && (
                        <div ref={observerRef} aria-hidden='true'>
                            <span></span>
                        </div>
                    )}
                </section>
            </section>
        </div>
    );
};

export default Recipes;
