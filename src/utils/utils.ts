export const commentCreatedTime = (createdAt: string) => {
    const now = new Date();
    const date = new Date(createdAt);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays >= 1) {
        return formatDateToString(createdAt);
    } else if (diffInHours >= 1) {
        return `${diffInHours}시간전`;
    } else if (diffInMinutes >= 1) {
        return `${diffInMinutes}분전`;
    } else {
        return '방금전';
    }
};

export const formatDateToString = (createdAt: string): string => {
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
};
