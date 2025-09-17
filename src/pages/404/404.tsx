import EmptyState from '../../components/EmptyState/EmptyState';
import { usePageSetup } from '../../hooks/usePageSetup';
import styles from './404.module.css';

const NotFound = () => {
    usePageSetup({
        title: '',
        pageName: '404',
        showBackButton: true,
    });

    return (
        <section className={styles.container}>
            <EmptyState title='페이지를 찾을 수 없어요' />
        </section>
    );
};

export default NotFound;
