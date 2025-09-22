import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Keyboard from 'react-simple-keyboard';
import hangul from 'hangul-js';
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
    const [layoutName, setLayoutName] = useState<'english' | 'englishShift' | 'korean' | 'koreanShift'>('korean');
    const [currentLanguage, setCurrentLanguage] = useState<LanguageType>('ko');
    const keyboardRef = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const blurTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const isComposingRef = useRef(false);
    const isVirtualKeyboardInputRef = useRef(false);

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

    // 한글 조합 이벤트 처리
    const handleCompositionStart = useCallback(() => {
        isComposingRef.current = true;
    }, []);

    const handleCompositionEnd = useCallback(() => {
        isComposingRef.current = false;
    }, []);

    // 입력 변경 처리 - 한글 조합 고려
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 가상 키보드 입력이면 처리하지 않음
        if (isVirtualKeyboardInputRef.current) {
            return;
        }

        const newValue = e.target.value;
        onChange(newValue);

        // 가상 키보드 동기화 (조합 중이 아닐 때만)
        if (showKeyboard && !isComposingRef.current && keyboardRef.current) {
            keyboardRef.current.setInput(newValue);
        }
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
            if (showKeyboard) return;
            setIsFocused(false);
        }, 150);
    }, [showKeyboard]);

    // 키보드 버튼 클릭 핸들러
    const handleKeyboardButtonClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (!showKeyboard) {
                setShowKeyboard(true);
                requestAnimationFrame(() => {
                    inputRef.current?.focus();
                    if (keyboardRef.current) {
                        keyboardRef.current.setInput(value);
                    }
                });
            }
        },
        [showKeyboard, value]
    );

    // 가상 키보드 키 입력 처리 - onChange 제거하고 onKeyPress만 사용
    const onKeyPress = useCallback(
        (button: string) => {
            isVirtualKeyboardInputRef.current = true;

            if (button === '{shift}') {
                if (currentLanguage === 'en') {
                    setLayoutName(prev => (prev === 'english' ? 'englishShift' : 'english'));
                } else {
                    setLayoutName(prev => (prev === 'korean' ? 'koreanShift' : 'korean'));
                }
            } else if (button === '{lang}') {
                setCurrentLanguage(prev => {
                    const next = prev === 'en' ? 'ko' : 'en';
                    setLayoutName(next === 'en' ? 'english' : 'korean');
                    return next;
                });
            } else if (button === '{enter}') {
                const trimmedValue = value.trim();
                if (trimmedValue && onSubmit) {
                    onSubmit(trimmedValue);
                }
                setShowKeyboard(false);
            } else if (button === '{bksp}') {
                // 백스페이스
                const newValue = value.slice(0, -1);
                onChange(newValue);
                if (inputRef.current) {
                    inputRef.current.value = newValue;
                }
            } else if (button === '{space}') {
                // 스페이스
                const newValue = value + ' ';
                onChange(newValue);
                if (inputRef.current) {
                    inputRef.current.value = newValue;
                }
            } else {
                // 일반 문자 입력 - 한글 조합 로직
                if (button.length === 1) {
                    let newValue: string;

                    if (currentLanguage === 'ko') {
                        // 한글 모드: hangul.assemble(hangul.disassemble(prev + key))
                        newValue = hangul.assemble(hangul.disassemble(value + button));
                    } else {
                        // 영어 모드: 단순 추가
                        newValue = value + button;
                    }

                    onChange(newValue);
                    if (inputRef.current) {
                        inputRef.current.value = newValue;
                    }
                }
            }

            // 다음 프레임에서 플래그 리셋
            requestAnimationFrame(() => {
                isVirtualKeyboardInputRef.current = false;
            });
        },
        [currentLanguage, value, onSubmit, onChange]
    );

    // 외부 클릭 이벤트 처리
    const handleClickOutside = useCallback((event: MouseEvent) => {
        const target = event.target as Element;
        const keyboardButton = target.closest(`.${styles['search__keyboard-button']}`);

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
                                onCompositionStart={handleCompositionStart}
                                onCompositionEnd={handleCompositionEnd}
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
                        onKeyPress={onKeyPress}
                        layoutName={layoutName}
                        layout={KEYBOARD_LAYOUTS}
                        display={keyboardDisplay}
                        theme='hg-theme-default'
                        buttonTheme={BUTTON_THEME}
                        disableCaretPositioning={true}
                        preventMouseDownDefault={true}
                    />
                </div>
            )}
        </>
    );
};

export default SearchInput;
