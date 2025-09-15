import { NavLink, useNavigate } from 'react-router-dom';
import useSearch from '../../hooks/useSearch.tsx';
import type { RecipeSortBy } from '../../types/search.types.ts';
import PostItem from '../../components/postItem/PostItem.tsx';
import { useEffect, useState } from 'react';
import { fetchCategories } from '../../services/supabaseCategories.ts';
import type { Tables } from '../../types/supabase.ts';
import { usePageSetup } from '../../hooks/usePageSetup.tsx';
import styles from './recipes.module.css';
import { useModal } from '../../hooks/useModal.tsx';
import Modal from '../../components/modal/Modal.tsx';
import useUserStore from '../../stores/useUserStore.ts';

const Recipes = ({ query }: { query?: string }) => {
    const [categories, setCategories] = useState<Tables<'categories'>[]>([]);
    const navigate = useNavigate();
    const { searchList, updateSearchTerm, updateRecipeSortBy, updateCategory } = useSearch({
        pageType: 'recipe',
        initialParams: {
            searchTerm: query,
        },
    });
    const { isOpen, type: modalType, openModal, closeModal } = useModal();
    const { user } = useUserStore();

    const handleFilter = (filter: RecipeSortBy) => {
        updateRecipeSortBy(filter);
    };

    const getCategories = async () => {
        const data = await fetchCategories();
        setCategories(data);
    };

    const handleModalConfirm = () => {
        if (modalType === 'LOGIN') {
            navigate('/login'); // 로그인 페이지로 이동
        }
        closeModal();
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
                <ul>
                    <li>
                        <button type='button' onClick={() => updateCategory('')}>
                            전체
                        </button>
                    </li>
                    {categories.map(data => (
                        <li key={data.id}>
                            <button type='button' onClick={() => updateCategory(data.id)}>
                                {data.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

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
                    <NavLink to='/recipes/form'>레시피 등록하기</NavLink>
                ) : (
                    <button type='button' onClick={() => openModal('LOGIN')}>
                        레시피 등록하기
                    </button>
                )}
            </div>

            <section className={styles['recipe__list']}>
                <h2 className='sr-only'>레시피 목록</h2>

                {searchList.map(item => (
                    <PostItem
                        key={item.id}
                        post={item}
                        type='recipe'
                        onClick={postId => navigate(`/recipes/${postId}`)}
                    />
                ))}
            </section>

            <Modal isOpen={isOpen} type={modalType} onClose={closeModal} onConfirm={handleModalConfirm} />
        </div>
    );
};

export default Recipes;
