import { Link } from 'react-router-dom';
import { usePageSetup } from '../../hooks/usePageSetup';
const Mypage = () => {
    usePageSetup({
        title: '마이페이지',
        pageName: 'mypage',
        showBackButton: true, // 뒤로가기 버튼 표시
    });
    return (
        <div>
            <Link to='/mypage/edit'>회원정보 수정</Link>
        </div>
    );
};

export default Mypage;
