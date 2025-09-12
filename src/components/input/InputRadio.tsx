const InputRadio = ({
    label,
    id,
    name,
    value,
    isRequired,
    handleInput,
}: {
    label: string;
    id: string;
    name: string;
    value: string;
    isRequired?: boolean;
    handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input type='radio' id={id} name={name} value={value} onChange={handleInput} required={isRequired} />
        </div>
    );
};

export default InputRadio;
