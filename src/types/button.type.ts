export interface ButtonType {
    text: string;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large' | 'free';
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}
