import styles from './validationText.module.css';

const ValidationText = ({ isPassed, text }: { isPassed: boolean | null; text: string }) => {
    return (
        <span
            className={
                isPassed === null
                    ? styles['validation-text--hidden']
                    : isPassed
                      ? styles['validation-text']
                      : styles['validation-text--warn']
            }
        >
            {text}
        </span>
    );
};

export default ValidationText;
