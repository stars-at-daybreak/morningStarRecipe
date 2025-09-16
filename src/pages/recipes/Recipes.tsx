import { NavLink, useNavigate } from 'react-router-dom';
import useSearch from '../../hooks/useSearch.tsx';
import type { RecipeSortBy } from '../../types/search.types.ts';
import { useEffect, useState } from 'react';
import { fetchCategories } from '../../services/supabaseCategories.ts';
import type { Tables } from '../../types/supabase.ts';
import { usePageSetup } from '../../hooks/usePageSetup.tsx';
import { useModal } from '../../components/modal/ModalContext';
import styles from './recipes.module.css';
import useUserStore from '../../stores/useUserStore.ts';
import { getRecipesWithPagination } from '../../services/supabasePosts';
import InfinitePostList from '../../components/infiniteScroll/InfiniteScroll.tsx';

const Recipes = ({ query }: { query?: string }) => {
    const [categories, setCategories] = useState<Tables<'categories'>[]>([]);
    const navigate = useNavigate();
    const { updateSearchTerm, updateRecipeSortBy, updateCategory } = useSearch({
        pageType: 'recipe',
        initialParams: {
            searchTerm: query,
        },
    });
    const { user } = useUserStore();
    const { openModal } = useModal();

    const handleFilter = (filter: RecipeSortBy) => {
        updateRecipeSortBy(filter);
    };

    const handlePostClick = (postId: string) => {
        navigate(`/recipes/${postId}`);
    };

    const getCategories = async () => {
        const data = await fetchCategories();
        setCategories(data);
    };


    usePageSetup({
        title: '모두의 레시피',
        pageName: 'signup',
        showBackButton: true,
    });

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <div className={styles['recipe']}>
            <section className={styles['recipe__category']}>
                <h2 className='sr-only'>카테고리</h2>
                <div className={styles['recipe__category-border']}>
                    <ul>
                        <li>
                            <button
                                className={styles['recipe__category-button']}
                                type='button'
                                onClick={() => updateCategory('')}
                            >
                                전체
                            </button>
                        </li>
                        {categories.map(data => (
                            <li key={data.id}>
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
                    <label htmlFor='search'>검색어</label>
                    <input id='search' defaultValue={query} onChange={e => updateSearchTerm(e.target.value)} />
                </div>

                <div className={styles['recipe__button-box']}>
                    <ul className={styles['recipe__order']}>
                        <li>
                            <button type='button' onClick={() => handleFilter('recently')}>
                                최신순
                            </button>
                        </li>
                        <li>
                            <button type='button' onClick={() => handleFilter('recommended')}>
                                추천순
                            </button>
                        </li>
                        <li>
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

                <section className={styles['recipe__list-box']}>
                    <h2 className='sr-only'>레시피 목록</h2>

                    <InfinitePostList
                        type='recipe'
                        fetchFunction={getRecipesWithPagination}
                        onPostClick={handlePostClick}
                    />
                </section>
            </section>
        </div>
    );
};

export default Recipes;
