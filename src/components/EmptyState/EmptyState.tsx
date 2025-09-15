import styles from './EmptyState.module.css';

interface EmptyStateProps {
    title: string;
    description?: string;
}

const EmptyState = ({ title, description }: EmptyStateProps) => {
    return (
        <div className={styles['empty-state']}>
            <div className={styles['empty-state__icon']}>
            </div>
            <h3 className={styles['empty-state__title']}>{title}</h3>
            {description && <p className={styles['empty-state__description']}>{description}</p>}
        </div>
    );
};

export default EmptyState;
