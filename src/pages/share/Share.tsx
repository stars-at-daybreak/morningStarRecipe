import { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import useSearch from '../../hooks/useSearch';
import useUserStore from '../../stores/useUserStore';
import { usePageSetup } from '../../hooks/usePageSetup';
import PostItem from '../../components/postItem/PostItem';
import SearchInput from '../../components/search/SearchFromList';
import type { ShareStatus } from '../../types/search.types';
import styles from './sharePage.module.css';
import writeSVG from '../../assets/write_icon.svg';
import { useModal } from '../../components/modal/ModalContext';
import EmptyState from '../../components/emptyState/EmptyState';
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
// ------------------- 필터 옵션 -------------------
const filterOptions: { value: ShareStatus; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'available', label: '나눔중' },
    { value: 'reserved', label: '예약중' },
    { value: 'completed', label: '완료' },
    { value: 'cancelled', label: '취소' },
];
// ------------------- Share 컴포넌트 -------------------
const Share = () => {
    const { user } = useUserStore();
    const { openModal } = useModal();
    const navigate = useNavigate();
    const location = useLocation();

    // URL query 가져오기
    const initialQuery = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get('query') || '';
    }, [location.search]);

    // 페이지 셋업 (한 번만 실행)
    usePageSetup({
        title: '모두의 나눔',
        pageName: 'share',
        showBackButton: true,
    });

    // 검색 입력 상태
    const [inputValue, setInputValue] = useState(initialQuery);
    const debouncedInput = useDebounce(inputValue, 500);

    // ------------------- useSearch 설정 -------------------
    const searchConfig = useMemo(
        () => ({
            pageType: 'share' as const,
            initialParams: { searchTerm: initialQuery },
            enableInfiniteScroll: true,
            pageSize: 5,
        }),
        [initialQuery]
    );

    const {
        searchList,
        loading,
        loadingMore,
        error,
        totalCount,
        hasMore,
        loadMore,
        currentShareStatus,
        updateSearchParams,
        searchParams, // 새롭게 추가
    } = useSearch(searchConfig);
    // 초기 검색
    useEffect(() => {
        if (searchParams.searchTerm !== debouncedInput.toString()) {
            updateSearchParams({ searchTerm: debouncedInput.toString() });
        }
    }, [debouncedInput, updateSearchParams, searchParams.searchTerm]);
    // ------------------- 무한 스크롤 -------------------
    const observerRef = useRef<HTMLDivElement>(null);
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [target] = entries;
            if (target.isIntersecting && hasMore && !loadingMore && !loading) {
                loadMore();
            }
        },
        [hasMore, loadingMore, loading, loadMore]
    );

    useEffect(() => {
        const element = observerRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(handleObserver, {
            threshold: 0.1,
            rootMargin: '100px',
        });
        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [handleObserver]);

    // ------------------- 필터 변경 -------------------
    const handleFilter = useCallback(
        (status: ShareStatus) => {
            updateSearchParams({ shareStatus: status });
        },
        [updateSearchParams]
    );

    // ------------------- 검색 입력 핸들러 -------------------
    const handleSearchChange = useCallback((val: string) => {
        setInputValue(val);
    }, []);

    // ------------------- 로그인 모달 -------------------
    const handleLoginModalOpen = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            openModal('LOGIN');
        },
        [openModal]
    );

    // ------------------- 게시글 클릭 -------------------
    const handlePostClick = useCallback(
        (postId: string | number) => {
            navigate(`/share/${postId}`);
        },
        [navigate]
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
    // ------------------- 렌더링 -------------------
    return (
        <>
            <title>모두의 나눔 - 모두의 부엌</title>
            <meta
                name='description'
                content='이웃과 함께하는 따뜻한 재료 나눔. 남은 식재료를 나누고 필요한 재료를 얻어보세요.'
            />
            <meta name='keywords' content='재료나눔, 식재료 나눔, 음식나눔, 이웃나눔, 무료나눔, 재료교환' />
            <meta property='og:title' content='모두의 나눔 - 모두의 부엌' />
            <meta
                property='og:description'
                content='이웃과 함께하는 따뜻한 재료 나눔. 남은 식재료를 나누고 필요한 재료를 얻어보세요.'
            />
            <meta property='og:image' content='https://morningstarrecipe.netlify.app/assets/og_image.png' />
            <meta property='og:type' content='website' />
            <meta property='og:url' content='https://morningstarrecipe.netlify.app/share' />
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content='재료 나눔 - 모두의 부엌' />
            <meta
                name='twitter:description'
                content='이웃과 함께하는 따뜻한 재료 나눔. 남은 식재료를 나누고 필요한 재료를 얻어보세요.'
            />
            <meta name='twitter:image' content='https://morningstarrecipe.netlify.app/assets/og_image.png' />
            <meta name='robots' content='index, follow' />
            <link rel='canonical' href='https://morningstarrecipe.netlify.app/share' />

            <main className={styles.sharePage}>
                <header className={styles.sharePage__header}>
                    <div className={styles.sharePage__inputWrapper}>
                        <SearchInput
                            value={inputValue}
                            placeholder='어떤 물건을 찾고 계신가요?'
                            onChange={handleSearchChange}
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
                                    disabled={loading}
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
                                    나눔 하기
                                </NavLink>
                            ) : (
                                <button
                                    type='button'
                                    onClick={handleLoginModalOpen}
                                    className={styles.sharePage__register}
                                    aria-label='로그인 후 나눔글 작성하기'
                                >
                                    <img src={writeSVG} className={styles.sharePage__icon} alt='' aria-hidden='true' />
                                    나눔 하기
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                <section className={styles.sharePage__results} aria-live='polite'>
                    <h2 className='sr-only'>나눔 게시글 목록 (총 {totalCount}개)</h2>

                    {loading ? (
                        <div className={styles.sharePage__loading}>
                            {' '}
                            {/* <SyncLoader color='var(--color-green)' size={spinnerSize} margin={2} /> */}
                        </div>
                    ) : (
                        <>
                            {!error && searchList.length === 0 && (
                                <div className={styles.sharePage__noneresults}>
                                    <h2 className='sr-only'>검색 결과가 없습니다</h2>
                                    <EmptyState title='아직 아무것도 없어요' />
                                </div>
                            )}

                            {searchList.map(item => (
                                <PostItem
                                    key={item.id}
                                    post={item}
                                    type='share'
                                    onClick={() => handlePostClick(item.id)}
                                />
                            ))}

                            {loadingMore && <div className='loading-more'></div>}

                            {hasMore && !loadingMore && searchList.length > 0 && (
                                <div ref={observerRef} aria-hidden='true'>
                                    <span></span>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>
        </>
    );
};

export default Share;
