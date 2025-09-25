import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Keyboard from 'react-simple-keyboard';
import hangul from 'hangul-js';
import 'react-simple-keyboard/build/css/index.css';
import styles from './searchForm.module.css';
import search_icon from '../../assets/search_icon.svg';
import keyboard_icon from '../../assets/keyboard_icon.svg';

// 언어 타입 정의
type LanguageType = 'ko' | 'en';

// 한글 키보드 레이아웃
const KOREAN_LAYOUT = {
    default: [
        '1 2 3 4 5 6 7 8 9 0 {bksp}',
        'ㅂ ㅈ ㄷ ㄱ ㅅ ㅛ ㅕ ㅑ ㅐ ㅔ',
        'ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ {enter}',
        '{shift} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ {shift}',
        '{lang} {space}',
    ],
    shift: [
        '! @ # $ % ^ & * ( ) {bksp}',
        'ㅃ ㅉ ㄸ ㄲ ㅆ ㅛ ㅕ ㅑ ㅒ ㅖ',
        'ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ {enter}',
        '{shift} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ {shift}',
        '{lang} {space}',
    ],
};

// 영어 키보드 레이아웃
const ENGLISH_LAYOUT = {
    default: [
        '1 2 3 4 5 6 7 8 9 0 {bksp}',
        'q w e r t y u i o p',
        'a s d f g h j k l {enter}',
        '{shift} z x c v b n m {shift}',
        '{lang} {space}',
    ],
    shift: [
        '! @ # $ % ^ & * ( ) {bksp}',
        'Q W E R T Y U I O P',
        'A S D F G H J K L {enter}',
        '{shift} Z X C V B N M {shift}',
        '{lang} {space}',
    ],
};

const SearchForm: React.FC = memo(() => {
    const navigate = useNavigate();

    // State 관리
    const [query, setQuery] = useState<string>('');
    const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [currentLanguage, setCurrentLanguage] = useState<LanguageType>('ko');
    const [layoutName, setLayoutName] = useState<string>('default');

    // Refs
    const inputRef = useRef<HTMLInputElement>(null);
    const keyboardRef = useRef<any>(null);
    const blurTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const isComposingRef = useRef(false);

    // 검색 처리
    const handleSearch = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const trimmedQuery = query.trim();
            if (trimmedQuery) {
                navigate(`/?query=${encodeURIComponent(trimmedQuery)}`);
                setShowKeyboard(false);
            }
        },
        [query, navigate]
    );

    // 입력창 포커스 처리
    const handleInputFocus = useCallback(() => {
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = undefined;
        }
        setIsFocused(true);
    }, []);

    const handleInputBlur = useCallback(() => {
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
        }
        blurTimeoutRef.current = setTimeout(() => {
            setIsFocused(false);
        }, 150);
    }, []);

    // 한글 조합 이벤트 처리
    const handleCompositionStart = useCallback(() => {
        isComposingRef.current = true;
    }, []);

    const handleCompositionEnd = useCallback(() => {
        isComposingRef.current = false;
    }, []);

    // 입력창 값 변경
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    // 키보드 토글
    const handleKeyboardToggle = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setShowKeyboard(prev => {
            if (!prev) {
                requestAnimationFrame(() => {
                    inputRef.current?.focus();
                });
            }
            return !prev;
        });
    }, []);

    // 가상 키보드 키 입력 처리
    const onKeyPress = useCallback(
        (key: string) => {
            if (key === '{bksp}') {
                // 백스페이스
                const newValue = query.slice(0, -1);
                setQuery(newValue);
                if (inputRef.current) {
                    inputRef.current.value = newValue;
                }
            } else if (key === '{shift}') {
                // Shift 토글
                setLayoutName(prev => (prev === 'default' ? 'shift' : 'default'));
            } else if (key === '{enter}') {
                // 엔터 (검색)
                const trimmedQuery = query.trim();
                if (trimmedQuery) {
                    navigate(`/?query=${encodeURIComponent(trimmedQuery)}`);
                    setShowKeyboard(false);
                }
            } else if (key === '{space}') {
                // 스페이스
                const newValue = query + ' ';
                setQuery(newValue);
                if (inputRef.current) {
                    inputRef.current.value = newValue;
                }
            } else if (key === '{lang}') {
                // 언어 전환
                setCurrentLanguage(prev => {
                    const newLang = prev === 'en' ? 'ko' : 'en';
                    setLayoutName('default'); // 언어 전환시 shift 해제
                    return newLang;
                });
            } else {
                // 일반 문자 입력 - 한글 조합 로직
                if (currentLanguage === 'ko') {
                    // 한글 모드: hangul.assemble(hangul.disassemble(prev + key))
                    const newValue = hangul.assemble(hangul.disassemble(query + key));
                    setQuery(newValue);
                    if (inputRef.current) {
                        inputRef.current.value = newValue;
                    }
                } else {
                    // 영어 모드: 단순 추가
                    const newValue = query + key;
                    setQuery(newValue);
                    if (inputRef.current) {
                        inputRef.current.value = newValue;
                    }
                }
            }
        },
        [query, navigate, currentLanguage]
    );

    // 현재 언어에 따른 레이아웃
    const currentLayout = useMemo(() => {
        return currentLanguage === 'ko' ? KOREAN_LAYOUT : ENGLISH_LAYOUT;
    }, [currentLanguage]);

    // 키보드 표시 텍스트
    const keyboardDisplay = useMemo(
        () => ({
            '{bksp}': '⌫',
            '{enter}': '검색',
            '{shift}': '⇧',
            '{space}': '스페이스',
            '{lang}': currentLanguage === 'en' ? '한글' : 'Eng',
        }),
        [currentLanguage]
    );

    // 외부 클릭 이벤트 처리
    const handleClickOutside = useCallback((event: MouseEvent) => {
        const target = event.target as Element;

        if (!target.closest(`.${styles.search__container}`) && !target.closest('.hg-theme-default')) {
            setShowKeyboard(false);
        }
    }, []);

    // 외부 클릭 리스너 등록/해제
    useEffect(() => {
        if (showKeyboard) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showKeyboard, handleClickOutside]);

    // cleanup 처리
    useEffect(() => {
        return () => {
            if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            <section className={styles.search} role='search' aria-label='검색'>
                <form className={styles.search__form} onSubmit={handleSearch}>
                    <div className={styles.search__container}>
                        <label htmlFor='search-query' className={`${styles.search__label} sr-only`}>
                            검색어 입력
                        </label>
                        <div className={styles.search__input_wrapper}>
                            <input
                                ref={inputRef}
                                id='search-query'
                                name='query'
                                type='text'
                                value={query}
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                onCompositionStart={handleCompositionStart}
                                onCompositionEnd={handleCompositionEnd}
                                className={styles.search__input}
                                placeholder='오늘의 메뉴를 검색하세요'
                                autoComplete='off'
                                spellCheck={false}
                                aria-describedby='search-hint'
                            />

                            {/* 키보드 아이콘 */}
                            {isFocused && (
                                <button
                                    type='button'
                                    onClick={handleKeyboardToggle}
                                    className={styles.keyboard__button}
                                    aria-label={showKeyboard ? '가상 키보드 닫기' : '가상 키보드 열기'}
                                    tabIndex={-1}
                                >
                                    <img src={keyboard_icon} className={styles.keyboard__icon} alt='' loading='eager' />
                                </button>
                            )}

                            <button type='submit' className={styles.search__button} aria-label='검색 실행'>
                                <img src={search_icon} className={styles.search__icon} alt='' loading='eager' />
                            </button>
                        </div>
                    </div>
                </form>
            </section>

            {/* 가상 키보드 */}
            {showKeyboard && (
                <div className={styles.keyboard__container}>
                    <Keyboard
                        ref={keyboardRef}
                        onKeyPress={onKeyPress}
                        layoutName={layoutName}
                        layout={currentLayout}
                        display={keyboardDisplay}
                        theme='hg-theme-default'
                        disableCaretPositioning={true}
                        preventMouseDownDefault={true}
                    />
                </div>
            )}
        </>
    );
});

SearchForm.displayName = 'SearchForm';

export default SearchForm;
