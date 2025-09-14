import styles from './nicknameButton.module.css';
import { checkNicknameExists } from '../../services/supabaseUsers.ts';

const NicknameButton = ({
    nickname,
    handleDuplicate,
}: {
    nickname: string;
    handleDuplicate: (isDuplicated: boolean | null) => void;
}) => {
    const handleDuplicateCheck = async () => {
        if (!nickname) return;

        const nicknameExists = await checkNicknameExists(nickname);

        if (nicknameExists) {
            handleDuplicate(true);
        } else {
            handleDuplicate(false);
        }
    };

    return (
        <button className={styles['duplicate-check__btn']} type='button' onClick={handleDuplicateCheck}>
            중복확인
        </button>
    );
};

export default NicknameButton;
