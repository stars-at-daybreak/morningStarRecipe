import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import SignUp from './pages/signup/SignUp.tsx';
import Login from './pages/login/Login.tsx';
import Layout from './pages/Layout.tsx';
import Home from './pages/home/Home.tsx';
import { AuthProvider } from './providers/AuthProvider.tsx';
import Mypage from './pages/mypage/Mypage.tsx';
import ProfileEditForm from './pages/mypage/ProfileEditForm.tsx';
import useUserStore from './stores/useUserStore.ts';
import { colorSet } from './types/colorSet.ts';
import Privacy from './pages/Privacy.tsx';
import Terms from './pages/Terms.tsx';
import ModalTestPage from './pages/ModalTestPage.tsx';
import Recipes from './pages/recipes/Recipes.tsx';
import RecipeForm from './components/RecipeForm.tsx';
import RecipeDetail from './components/RecipeDetail.tsx';

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
                    <AppRoutes />
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
};

const AppRoutes = () => {
    const { user, isLoading } = useUserStore();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Routes>
            <Route path='/modal-test' element={<ModalTestPage />} />
            <Route path='/' element={<Layout />}>
                <Route index path='/' element={<Home />} />
                <Route path='/login' element={!user ? <Login /> : <Navigate to='/' replace={true} />} />
                <Route path='/signup' element={!user ? <SignUp /> : <Navigate to='/' replace={true} />} />
                <Route path='/mypage' element={!user ? <Login /> : <Mypage />} />
                <Route path='/mypage/edit' element={!user ? <Login /> : <ProfileEditForm />} />
                <Route path='/recipes' element={<Recipes />} />
                <Route path='/recipes/form' element={<RecipeForm />} />
                <Route path='/recipes/:id' element={<RecipeDetail />} />
                <Route path='/privacy' element={<Privacy />} />
                <Route path='/Terms' element={<Terms />} />
            </Route>
        </Routes>
    );
};

export default App;
