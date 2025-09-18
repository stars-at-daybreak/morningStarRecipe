import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import SignUp from './pages/signup/SignUp.tsx';
import Login from './pages/login/Login.tsx';
import Layout from './pages/Layout/Layout.tsx';
import Home from './pages/home/Home.tsx';
import { AuthProvider } from './providers/AuthProvider.tsx';
import ModalProvider from './components/modal/ModalProvider.tsx';
import Mypage from './pages/mypage/Mypage.tsx';
import ProfileEditForm from './pages/mypage/ProfileEditForm.tsx';
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
import PasswordFind from './components/PasswordFind.tsx';
import DeleteAccount from './pages/mypage/DeleteAccount.tsx';
import NotFound from './pages/404/404.tsx';
import './App.css';
import MyBookmark from './pages/mypage/MyBookmark.tsx';
import MyPostList from './pages/mypage/MyPostList.tsx';

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
    const { user } = useUserStore();

    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index path='/' element={<Home />} />
                <Route path='/login' element={!user ? <Login /> : <Navigate to='/' replace={true} />} />
                <Route path='/password' element={<PasswordFind />} />
                <Route path='/signup' element={!user ? <SignUp /> : <Navigate to='/' replace={true} />} />
                <Route path='/mypage' element={!user ? <Login /> : <Mypage />} />
                <Route path='/mypage/user-edit' element={!user ? <Login /> : <ProfileEditForm />} />
                <Route path='/mypage/my-bookmark' element={<MyBookmark />} />
                <Route path='/mypage/my-postList' element={<MyPostList />} />
                <Route path='/mypage/privacy' element={<Privacy />} />
                <Route path='/mypage/terms' element={<Terms />} />
                <Route path='/mypage/delete-account' element={<DeleteAccount />} />
                <Route path='/recipes' element={<Recipes />} />
                <Route path='/recipes/form' element={<RecipeForm />} />
                <Route path='/recipes/:id' element={<RecipeDetail />} />
                <Route path='/share' element={<Share />} />
                <Route path='/share/form' element={<ShareForm />} />
                <Route path='/share/:id' element={<ShareDetail />} />
                <Route path='/404' element={<NotFound />} />
            </Route>
        </Routes>
    );
};

export default App;
