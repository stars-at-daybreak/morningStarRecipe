import { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useSearch from '../../hooks/useSearch';
import useUserStore from '../../stores/useUserStore';
import { usePageSetup } from '../../hooks/usePageSetup';
import PostItem from '../../components/postItem/PostItem';
import SearchInput from '../../components/search/SearchFromList';
import { useModal } from '../../hooks/useModal';
import type { ShareStatus } from '../../types/search.types';
import styles from './SharePage.module.css';
import writeSVG from '../../assets/write_icon.svg';

const Share = ({ query }: { query?: string }) => {
    //페이지 설정
    const { user } = useUserStore();
    const { openModal } = useModal();
    usePageSetup({
        title: '모두의 나눔',
        pageName: 'share',
        showBackButton: false,
    });

    //navi
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState(query);
    const updateQuery = (query: string) => {
        if (query) navigate(`/share?query=${query}`);
    };
    //search, List
    const observerRef = useRef<HTMLDivElement>(null);
    const searchConfig = useMemo(() => {
        return {
            pageType: 'share' as const,
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
        updateShareStatus,
        currentShareStatus,
        hasMore,
        loadMore,
    } = useSearch(searchConfig);

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

    // 필터 핸들러
    const handleFilter = (status: ShareStatus) => {
        updateShareStatus(status);
    };

    // 필터 옵션 정의
    const filterOptions: { value: ShareStatus; label: string }[] = [
        { value: 'all', label: '전체' },
        { value: 'available', label: '나눔중' },
        { value: 'reserved', label: '예약중' },
        { value: 'completed', label: '완료' },
        { value: 'cancelled', label: '취소' },
    ];
    return (
        <main className={styles.sharePage}>
            <header className={styles.sharePage__header}>
                <div className={styles.sharePage__inputWrapper}>
                    <SearchInput
                        value={inputValue || ''}
                        onChange={val => {
                            setInputValue(val);
                            updateSearchTerm(val);
                            updateQuery(val);
                        }}
                    />
                </div>
                <div className={styles.sharePage__filterWrapper}>
                    <div className={styles.sharePage__filterList}>
                        {filterOptions.map(option => (
                            <button
                                key={option.value}
                                className={
                                    currentShareStatus === option.value
                                        ? styles.sharePage__filterBtn_active
                                        : styles.sharePage__filterBtn
                                }
                                aria-selected={currentShareStatus === option.value}
                                onClick={() => handleFilter(option.value)}
                            >
                                {option.label}
                            </button>
                        ))}
                        {user ? (
                            <NavLink
                                to='/share/form'
                                className={styles.sharePage__register}
                                aria-label='새 나눔글 작성하기'
                            >
                                <img src={writeSVG} className={styles.sharePage__icon} alt='' aria-hidden='true' />
                                나눔글 작성하기
                            </NavLink>
                        ) : (
                            <button
                                type='button'
                                onClick={e => {
                                    e.preventDefault();
                                    openModal('LOGIN');
                                }}
                                className={styles.sharePage__register}
                                aria-label='로그인 후 나눔글 작성하기'
                            >
                                <img src={writeSVG} className={styles.sharePage__icon} alt='' aria-hidden='true' />
                                나눔글 작성하기
                            </button>
                        )}
                    </div>
                </div>
            </header>
            {/* 게시글 목록 */}
            <section className={styles.sharePage__results} aria-live='polite'>
                <h2 className='sr-only'>나눔 게시글 목록 (총 {totalCount}개)</h2>
                {/* 검색 결과 없음 */}
                {searchList.length === 0 && (
                    <div>
                        <h2 className={styles.sharePage__noneresults}>검색 결과가 없습니다</h2>
                    </div>
                )}

                {/* 게시글 리스트 */}
                {searchList.map((item, index) => (
                    <div key={`${item.id}-${index}`}>
                        <PostItem post={item} type='share' onClick={postId => navigate(`/share/${postId}`)} />
                    </div>
                ))}
                {/* 무한스크롤 트리거 영역 - 시각화 */}
                {hasMore && !loadingMore && searchList.length > 0 && (
                    <div ref={observerRef} aria-hidden='true'>
                        <span></span>
                    </div>
                )}
            </section>
        </main>
    );
};

export default Share;
