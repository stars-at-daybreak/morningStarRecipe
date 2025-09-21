import styles from './inputRadio.module.css';
const InputRadio = ({
    label,
    id,
    name,
    value,
    isRequired,
    handleInput,
    checked,
    isDisabled,
}: {
    label: string;
    id: string;
    name: string;
    value: string;
    isRequired?: boolean;
    checked?: boolean;
    isDisabled?: boolean;
    handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <div className={styles['radio-group']}>
            <label htmlFor={id} className={styles['radio-group__label']}>
                <input
                    type='radio'
                    id={id}
                    name={name}
                    className={styles['radio-group__input']}
                    value={value}
                    onChange={handleInput}
                    required={isRequired}
                    checked={checked}
                    disabled={isDisabled}
                />
                {label}
            </label>
        </div>
    );
};

export default InputRadio;
