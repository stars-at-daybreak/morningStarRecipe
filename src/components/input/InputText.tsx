import styles from './inputText.module.css';
import type { InputTextType } from '../../types/inputText.type.ts';

const InputText = ({ label, id, name, state, type, handleInput, placeholder }: InputTextType) => {
    return (
        <div className={styles['input']}>
            <label htmlFor={id} className={styles['input__label']}>
                {label}
            </label>
            <div className={styles['input__group']}>
                <input
                    id={id}
                    name={name}
                    className={styles['input__field']}
                    type={type}
                    value={state}
                    onChange={handleInput}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};

export default InputText;
