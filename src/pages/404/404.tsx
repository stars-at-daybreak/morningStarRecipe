import EmptyState from '../../components/emptyState/EmptyState';
import { usePageSetup } from '../../hooks/usePageSetup';
import styles from './404.module.css';
const NotFound = () => {
    usePageSetup({
        title: '',
        pageName: '404',
        showBackButton: true,
    });

    return (
        <>
            <title>404 - Page Not Found</title>
            <meta name='robots' content='noindex, nofollow' />
            <section className={styles.container}>
                <EmptyState title='페이지를 찾을 수 없어요' />
            </section>
        </>
    );
};

export default NotFound;
