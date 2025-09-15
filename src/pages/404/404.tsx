import EmptyState from '../../components/EmptyState/EmptyState';
import { usePageSetup } from '../../hooks/usePageSetup';

const NotFound = () => {
    usePageSetup({
        title: '',
        pageName: '404',
        showBackButton: true,
    });

    return <EmptyState title='페이지를 찾을 수 없어요' />;
};

export default NotFound;
