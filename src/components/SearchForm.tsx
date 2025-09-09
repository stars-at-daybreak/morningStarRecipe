import React from 'react';
import { useNavigate } from 'react-router-dom';
const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    const navigate = useNavigate();
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;

    if (query.trim()) {
        // 검색 페이지로 이동
        navigate(`/?query=${encodeURIComponent(query.trim())}`);
    }
};
const SearchForm = () => {
    return (
        <form onSubmit={handleSearch}>
            <div>
                <input name='query' type='text' />
                <button type='submit'>검색</button>
            </div>
        </form>
    );
};

export default SearchForm;
