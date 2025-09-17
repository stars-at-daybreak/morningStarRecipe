// CustomSelect.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './SelectBox.module.css';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (e: { target: { value: string } }) => void;
    options: Option[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(option => option.value === value);

    const handleSelect = (optionValue: string) => {
        onChange({ target: { value: optionValue } });
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className={styles.customSelect}>
            <button type='button' onClick={() => setIsOpen(!isOpen)} className={styles.customSelect__button}>
                {selectedOption?.label || '선택하세요'}
                {/* 화살표 */}
            </button>

            {/* 드롭다운 */}
            {isOpen && (
                <div className={styles.customSelect__dropdown}>
                    {options.map(option => (
                        <button
                            key={option.value}
                            type='button'
                            onClick={() => handleSelect(option.value)}
                            className={`${styles.customSelect__option} ${option.value === value ? 'active' : ''}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;

// ShareForm.tsx에서 사용법:
/*
import CustomSelect from './CustomSelect';

// 기존 select 태그를 이걸로 교체
<CustomSelect
  value={formData.share_status}
  onChange={e => setFormData({
    ...formData,
    share_status: e.target.value as 'available' | 'reserved' | 'completed' | 'cancelled'
  })}
  options={[
    { value: 'available', label: '나눔중' },
    { value: 'reserved', label: '예약중' },
    { value: 'completed', label: '나눔완료' },
    { value: 'cancelled', label: '나눔취소' }
  ]}
/>
*/
