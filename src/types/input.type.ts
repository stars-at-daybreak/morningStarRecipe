export interface InputType {
    label: string;
    id: string;
    state: string;
    type: string;
    inputHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    rightButton?: {
        text: string;
        onClick: () => void;
    };
}