import type { ButtonType } from '../../types/button.type.ts';
import styles from './button.module.css';

const Button = ({
    text,
    type = 'button',
    variant = 'primary',
    size = 'medium',
    onClick,
    disabled = false,
    className,
}: ButtonType) => {
    const buttonClass = [styles.button, styles[`button--${variant}`], styles[`button--${size}`], className].filter(Boolean).join(' ');

    return (
        <button type={type} className={buttonClass} onClick={onClick} disabled={disabled}>
            {text}
        </button>
    );
};

export default Button;
