import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/signup/SignUp.tsx';
import Login from './pages/login/Login.tsx';
import Layout from './pages/Layout.tsx';
import Home from './pages/home/Home.tsx';
import { useAuth } from './hooks/useAuth.ts';
import Mypage from './pages/mypage/Mypage.tsx';
import ProfileEditForm from './pages/mypage/ProfileEditForm.tsx';

const App = () => {
    const { user } = useAuth();

    return (
        <div className='App'>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Layout />}>
                        <Route index path='/' element={<Home />} />
                        <Route path='/login' element={!user ? <Login /> : <Navigate to='/' replace={true} />} />
                        <Route path='/signup' element={!user ? <SignUp /> : <Navigate to='/' replace={true} />} />
                        <Route path='/mypage' element={!user ? <Login /> : <Mypage />} />
                        <Route path='/mypage/edit' element={!user ? <Login /> : <ProfileEditForm />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
