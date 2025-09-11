import styles from './input.module.css';
import type { InputType } from '../../types/input.type.ts';
import Button from '../button/Button.tsx';

const Input = ({ label, id, state, type, inputHandler, placeholder, rightButton }: InputType) => {
    return (
        <div className={styles['input']}>
            <label htmlFor={id} className={styles['input__label']}>{label}</label>
            <div className={styles['input__group']}>
                <input
                    id={id}
                    className={styles['input__field']}
                    type={type}
                    value={state}
                    onChange={inputHandler}
                    placeholder={placeholder}
                />
                {rightButton && (
                    <Button
                        type={rightButton.type}
                        text={rightButton.text}
                        onClick={rightButton.onClick}
                        variant={rightButton.variant}
                        size={rightButton.size}
                        disabled={rightButton.disabled}
                    />
                )}
            </div>
        </div>
    );
};

export default Input;
