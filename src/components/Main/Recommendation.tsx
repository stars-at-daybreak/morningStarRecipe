import styles from './Recommendation.module.css';
import { Link } from 'react-router-dom';
const Recommendation = () => {
    return (
        <ul className={styles.recommendation}>
            <li className={styles.item}>
                <Link to='/?query=된장 찌개'>된장 찌개</Link>
            </li>
            <li className={styles.item}>
                <Link to='/?query=미역국'>미역국</Link>
            </li>
            <li className={styles.item}>
                <Link to='/?query=떡볶이'>떡볶이</Link>
            </li>
        </ul>
    );
};

export default Recommendation;
