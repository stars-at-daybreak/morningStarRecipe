export interface InputTextType {
    label: string;
    id: string;
    name?: string;
    state: string;
    type: string;
    handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    className?: string;
}
