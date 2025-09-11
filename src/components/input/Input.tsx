import styles from './input.module.css';
import type { InputType } from '../../types/input.type.ts';

const Input = ({ label, id, state, type, inputHandler, placeholder, rightButton }: InputType) => {
    return (
        <div className={styles['input-wrapper']}>
            <label htmlFor={id}>{label}</label>
            <div className={styles['input-group']}>
                <input
                    id={id}
                    className={styles['input']}
                    type={type}
                    value={state}
                    onChange={inputHandler}
                    placeholder={placeholder}
                />
                {rightButton && (
                    <button type='button' onClick={rightButton.onClick}>
                        {rightButton.text}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Input;
