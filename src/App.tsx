import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import SignUp from './pages/signup/SignUp.tsx';
import Login from './pages/login/Login.tsx';
import Layout from './pages/Layout/Layout.tsx';
import Home from './pages/home/Home.tsx';
import { AuthProvider } from './providers/AuthProvider.tsx';
import ModalProvider from './components/modal/ModalProvider.tsx';
import Mypage from './pages/mypage/Mypage.tsx';
import UserEditForm from './pages/mypage/UserEditForm.tsx';
import useUserStore from './stores/useUserStore.ts';
import { colorSet } from './types/colorSet.ts';
import Privacy from './pages/mypage/Privacy.tsx';
import Terms from './pages/mypage/Terms.tsx';
import Recipes from './pages/recipes/Recipes.tsx';
import RecipeForm from './pages/recipes/RecipeForm.tsx';
import RecipeDetail from './pages/recipes/RecipeDetail.tsx';
import Share from './pages/share/Share.tsx';
import ShareForm from './pages/share/ShareForm.tsx';
import { ShareDetail } from './pages/share/ShareDetail.tsx';
import DeleteAccount from './pages/mypage/DeleteAccount.tsx';
import NotFound from './pages/404/404.tsx';
import './App.css';
import MyBookmark from './pages/mypage/MyBookmark.tsx';
import MyPostList from './pages/mypage/MyPostList.tsx';
import LevelupGuide from './pages/mypage/LevelupGuide.tsx';
import PasswordVerification from './pages/mypage/PasswordVerification.tsx';
import EmailAuthentication from './pages/login/EmailAuthentication.tsx';
import PasswordUpdate from './pages/login/PasswordUpdate.tsx';

const App = () => {
    // colorSet을 CSS 변수로 변환
    useEffect(() => {
        const root = document.documentElement;
        Object.entries(colorSet).forEach(([key, value]) => {
            const cssKey = key.replace(/[[\]']/g, '');
            root.style.setProperty(`--color-${cssKey}`, value);
        });
    }, []);

    return (
        <div className='App'>
            <BrowserRouter>
                <AuthProvider>
                    <ModalProvider>
                        <AppRoutes />
                    </ModalProvider>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
};

const AppRoutes = () => {
    const { user, isLoading } = useUserStore();
    if (isLoading) {
        return false;
    }
    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index path='/' element={<Home />} />
                <Route path='/login' element={!user ? <Login /> : <Navigate to='/' replace={true} />} />
                <Route
                    path='/password'
                    element={!user ? <EmailAuthentication /> : <Navigate to='/' replace={true} />}
                />
                <Route
                    path='/password/update'
                    element={!user ? <PasswordUpdate /> : <Navigate to='/' replace={true} />}
                />
                <Route path='/signup' element={!user ? <SignUp /> : <Navigate to='/' replace={true} />} />
                <Route path='/mypage' element={!user ? <Login /> : <Mypage />} />
                <Route path='/mypage/password-verification' element={!user ? <Login /> : <PasswordVerification />} />
                <Route path='/mypage/user-edit' element={!user ? <Login /> : <UserEditForm />} />
                <Route path='/mypage/my-bookmark' element={!user ? <Login /> : <MyBookmark />} />
                <Route path='/mypage/levelup-guide' element={!user ? <Login /> : <LevelupGuide />} />
                <Route path='/mypage/my-postList' element={!user ? <Login /> : <MyPostList />} />
                <Route path='/mypage/privacy' element={!user ? <Login /> : <Privacy />} />
                <Route path='/mypage/terms' element={!user ? <Login /> : <Terms />} />
                <Route path='/privacy' element={<Privacy />} />
                <Route path='/terms' element={<Terms />} />
                <Route path='/levelup-guide' element={<LevelupGuide />} />
                <Route path='/mypage/delete-account' element={!user ? <Login /> : <DeleteAccount />} />
                <Route path='/recipes' element={<Recipes />} />
                <Route path='/recipes/form' element={!user ? <Login /> : <RecipeForm />} />
                <Route path='/recipes/:id' element={<RecipeDetail />} />
                <Route path='/share' element={<Share />} />
                <Route path='/share/form' element={!user ? <Login /> : <ShareForm />} />
                <Route path='/share/:id' element={<ShareDetail />} />
                <Route path='*' element={<NotFound />} />
            </Route>
        </Routes>
    );
};

export default App;
