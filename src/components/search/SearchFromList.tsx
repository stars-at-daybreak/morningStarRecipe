import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import searchIcon from '../../assets/search_icon.svg';
import keyboardIcon from '../../assets/keyboard_icon.svg';
import styles from './SearchForm.module.css';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit?: (value: string) => void;
    placeholder?: string;
    style?: React.CSSProperties;
}

type LanguageType = 'ko' | 'en';

const KEYBOARD_LAYOUTS: { [key: string]: string[] } = {
    english: [
        '1 2 3 4 5 6 7 8 9 0 {bksp}',
        'q w e r t y u i o p',
        'a s d f g h j k l {enter}',
        '{shift} z x c v b n m {shift}',
        '{lang} {space}',
    ],
    englishShift: [
        '! @ # $ % ^ & * ( ) {bksp}',
        'Q W E R T Y U I O P',
        'A S D F G H J K L {enter}',
        '{shift} Z X C V B N M {shift}',
        '{lang} {space}',
    ],
    korean: [
        '1 2 3 4 5 6 7 8 9 0 {bksp}',
        'ㅂ ㅈ ㄷ ㄱ ㅅ ㅛ ㅕ ㅑ ㅐ ㅔ',
        'ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ {enter}',
        '{shift} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ {shift}',
        '{lang} {space}',
    ],
    koreanShift: [
        '! @ # $ % ^ & * ( ) {bksp}',
        'ㅃ ㅉ ㄸ ㄲ ㅆ ㅛ ㅕ ㅑ ㅒ ㅖ',
        'ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ {enter}',
        '{shift} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ {shift}',
        '{lang} {space}',
    ],
};

const BUTTON_THEME = [
    { class: 'keyboard__button--enter', buttons: '{enter}' },
    { class: 'keyboard__button--shift', buttons: '{shift}' },
    { class: 'keyboard__button--lang', buttons: '{lang}' },
];

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onSubmit, placeholder = '검색어 입력', style }) => {
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [layoutName, setLayoutName] = useState<'english' | 'englishShift' | 'korean' | 'koreanShift'>('english');
    const [currentLanguage, setCurrentLanguage] = useState<LanguageType>('en');
    const keyboardRef = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const blurTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // 검색 처리
    const handleSearch = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const trimmedValue = value.trim();
            if (trimmedValue && onSubmit) {
                onSubmit(trimmedValue);
                setShowKeyboard(false);
            }
        },
        [value, onSubmit]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        keyboardRef.current?.setInput(e.target.value);
    };

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
            // 키보드가 열려있으면 포커스 상태 유지
            if (showKeyboard) return;
            setIsFocused(false);
        }, 150);
    }, [showKeyboard]);

    // 키보드 버튼 클릭 핸들러 - 키보드가 닫혀있을 때만 열기
    const handleKeyboardButtonClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (!showKeyboard) {
                setShowKeyboard(true);
                requestAnimationFrame(() => {
                    inputRef.current?.focus();
                });
            }
        },
        [showKeyboard]
    );

    const onKeyboardChange = useCallback(
        (input: string) => {
            onChange(input);
        },
        [onChange]
    );

    const onKeyPress = useCallback(
        (button: string) => {
            if (button === '{shift}') {
                if (currentLanguage === 'en') {
                    setLayoutName(prev => (prev === 'english' ? 'englishShift' : 'english'));
                } else {
                    setLayoutName(prev => (prev === 'korean' ? 'koreanShift' : 'korean'));
                }
            }
            if (button === '{lang}') {
                setCurrentLanguage(prev => {
                    const next = prev === 'en' ? 'ko' : 'en';
                    setLayoutName(next === 'en' ? 'english' : 'korean');
                    return next;
                });
            }
            if (button === '{enter}') {
                const trimmedValue = value.trim();
                if (trimmedValue && onSubmit) {
                    onSubmit(trimmedValue);
                }
                setShowKeyboard(false);
            }
        },
        [currentLanguage, value, onSubmit]
    );

    // 외부 클릭 이벤트 처리
    const handleClickOutside = useCallback((event: MouseEvent) => {
        const target = event.target as Element;
        const keyboardButton = target.closest(`.${styles['search__keyboard-button']}`);

        // 키보드 버튼 클릭은 제외
        if (keyboardButton) {
            return;
        }

        const inputWrapper = target.closest(`.${styles.search__input_wrapper}`);
        const keyboardContainer = target.closest(`.${styles.keyboard__container}`);

        if (!inputWrapper && !keyboardContainer) {
            setShowKeyboard(false);
        }
    }, []);

    useEffect(() => {
        if (showKeyboard) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showKeyboard, handleClickOutside]);

    // 키보드가 닫힐 때 isFocused도 함께 관리
    useEffect(() => {
        if (!showKeyboard) {
            const timeout = setTimeout(() => {
                const activeElement = document.activeElement;
                const inputElement = inputRef.current;
                if (activeElement !== inputElement) {
                    setIsFocused(false);
                }
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [showKeyboard]);

    // cleanup 처리
    useEffect(() => {
        return () => {
            if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
            }
        };
    }, []);

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

    return (
        <>
            <section className={styles.search} role='search' aria-label='검색'>
                <form className={styles['search__form']} onSubmit={handleSearch}>
                    <div className={styles.search__container}>
                        <label htmlFor='search-query' className={`${styles.search__label} sr-only`}>
                            검색어 입력
                        </label>
                        <div className={styles.search__input_wrapper}>
                            <input
                                ref={inputRef}
                                id='search-query'
                                value={value}
                                onChange={handleChange}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                placeholder={placeholder}
                                className={styles['search__input']}
                                style={style}
                                autoComplete='off'
                                spellCheck={false}
                            />

                            {(isFocused || showKeyboard) && (
                                <button
                                    type='button'
                                    onClick={handleKeyboardButtonClick}
                                    className={styles.keyboard__button}
                                    aria-label={showKeyboard ? '가상 키보드 열림' : '가상 키보드 열기'}
                                    tabIndex={-1}
                                >
                                    <img src={keyboardIcon} alt='키보드 아이콘' className={styles['keyboard__icon']} />
                                </button>
                            )}
                            <button type='submit' className={styles['search__button']}>
                                <img src={searchIcon} alt='검색 아이콘' className={styles['search__icon']} />
                            </button>
                        </div>
                    </div>
                </form>
            </section>
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
};

export default SearchInput;
