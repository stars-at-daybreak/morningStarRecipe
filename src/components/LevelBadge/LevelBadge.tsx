import React from 'react';
import styles from './LevelBadge.module.css';

// 레벨 타입 정의
type LevelType = 1 | 2 | 3 | 4;

// 사이즈 타입 정의
type SizeType = 'small' | 'large';

// Props 타입 정의
interface LevelBadgeProps {
    level: LevelType;
    size: SizeType;
    className?: string;
}

// 레벨별 텍스트 매핑
const LEVEL_TEXT_MAP: Record<LevelType, string> = {
    1: 'LV.1 초보 집밥러',
    2: 'LV.2 우리집 요리사',
    3: 'LV.3 식탁 해결사',
    4: 'LV.4 집밥의 고수',
} as const;

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, size, className = '' }) => {
    // 레벨 유효성 검증
    if (![1, 2, 3, 4].includes(level)) {
        level = 1;
    }

    // 사이즈 유효성 검증
    if (!['small', 'large'].includes(size)) {
        size = 'small';
    }

    const badgeClasses = [styles.badge, styles[`badge--level${level}`], styles[`badge--${size}`], className]
        .filter(Boolean)
        .join(' ');

    return <span className={badgeClasses}>{LEVEL_TEXT_MAP[level]}</span>;
};

export default LevelBadge;

/* 사용법 */
/*
import LevelBadge from '../../components/LevelBadge/LevelBadge';

return (
  <>
    <LevelBadge level={1} size='large' />
  </>
)
*/
