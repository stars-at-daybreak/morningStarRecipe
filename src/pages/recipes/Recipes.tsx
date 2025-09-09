import { NavLink } from 'react-router-dom';

const Recipes = () => {
    return (
        <div>
            <NavLink to='/recipes/form'>레시피 등록하기</NavLink>
        </div>
    );
};

export default Recipes;
