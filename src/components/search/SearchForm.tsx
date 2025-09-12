import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import styles from './SearchForm.module.css';
import search_icon from '../../assets/search_icon.svg';
import keyboard_icon from '../../assets/keyboard_icon.svg';

// 언어 타입 정의
type LanguageType = 'ko' | 'en';

// 키보드 레이아웃 정의 (mutable array로 변경)
const KEYBOARD_LAYOUTS: { [key: string]: string[] } = {
    english: [
        '1 2 3 4 5 6 7 8 9 0 {bksp}',
        'q w e r t y u i o p',
        'a s d f g h j k l {enter}',
        '{shift} z x c v b n m {shift}',
        '{lang} @ {space}',
    ],
    englishShift: [
        '! @ # $ % ^ & * ( ) {bksp}',
        'Q W E R T Y U I O P',
        'A S D F G H J K L {enter}',
        '{shift} Z X C V B N M {shift}',
        '{lang} @ {space}',
    ],
    korean: [
        '1 2 3 4 5 6 7 8 9 0 {bksp}',
        'ㅂ ㅈ ㄷ ㄱ ㅅ ㅛ ㅕ ㅑ ㅐ ㅔ',
        'ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ {enter}',
        '{shift} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ {shift}',
        '{lang} @ {space}',
    ],
    koreanShift: [
        '! @ # $ % ^ & * ( ) {bksp}',
        'ㅃ ㅉ ㄸ ㄲ ㅆ ㅛ ㅕ ㅑ ㅒ ㅖ',
        'ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ {enter}',
        '{shift} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ {shift}',
        '{lang} @ {space}',
    ],
};

// 버튼 테마 정의
const BUTTON_THEME: Array<{ class: string; buttons: string }> = [
    {
        class: 'hg-button-enter',
        buttons: '{enter}',
    },
    {
        class: 'hg-button-shift',
        buttons: '{shift}',
    },
    {
        class: 'hg-button-lang',
        buttons: '{lang}',
    },
];

const SearchForm: React.FC = memo(() => {
    const navigate = useNavigate();

    // State 관리
    const [query, setQuery] = useState<string>('');
    const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [currentLanguage, setCurrentLanguage] = useState<LanguageType>('en');
    const [layoutName, setLayoutName] = useState<string>('english');

    // Refs - 초기값을 명시적으로 제공
    const inputRef = useRef<HTMLInputElement>(null);
    const keyboardRef = useRef<any>(null);
    const blurTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

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

    // 입력창 값 변경
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (keyboardRef.current) {
            keyboardRef.current.setInput(value);
        }
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

    // Shift 키 처리
    const handleShift = useCallback(() => {
        if (currentLanguage === 'en') {
            setLayoutName(prev => (prev === 'english' ? 'englishShift' : 'english'));
        } else {
            setLayoutName(prev => (prev === 'korean' ? 'koreanShift' : 'korean'));
        }
    }, [currentLanguage]);

    // 언어 전환 처리
    const handleLanguageToggle = useCallback(() => {
        setCurrentLanguage(prev => {
            const newLang = prev === 'en' ? 'ko' : 'en';
            setLayoutName(newLang === 'en' ? 'english' : 'korean');
            return newLang;
        });
    }, []);

    // 가상 키보드 입력 처리
    const onKeyboardChange = useCallback((input: string) => {
        setQuery(input);
        if (inputRef.current) {
            inputRef.current.value = input;
        }
    }, []);

    // 가상 키보드 키 입력 처리
    const onKeyPress = useCallback(
        (button: string) => {
            switch (button) {
                case '{shift}':
                case '{caps}':
                    handleShift();
                    break;
                case '{lang}':
                    handleLanguageToggle();
                    break;
                case '{enter}':
                    const trimmedQuery = query.trim();
                    if (trimmedQuery) {
                        navigate(`/?query=${encodeURIComponent(trimmedQuery)}`);
                        setShowKeyboard(false);
                    }
                    break;
            }
        },
        [handleShift, handleLanguageToggle, query, navigate]
    );

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
                        onChange={onKeyboardChange}
                        onKeyPress={onKeyPress}
                        layoutName={layoutName}
                        layout={KEYBOARD_LAYOUTS}
                        display={keyboardDisplay}
                        theme='hg-theme-default'
                        buttonTheme={BUTTON_THEME}
                    />
                </div>
            )}
        </>
    );
});

SearchForm.displayName = 'SearchForm';

export default SearchForm;
