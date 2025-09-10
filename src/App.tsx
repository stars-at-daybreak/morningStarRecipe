import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/signup/SignUp.tsx';
import Login from './pages/login/Login.tsx';
import Layout from './pages/Layout.tsx';
import Home from './pages/home/Home.tsx';
import { AuthProvider } from './providers/AuthProvider.tsx';
import Mypage from './pages/mypage/Mypage.tsx';
import ProfileEditForm from './pages/mypage/ProfileEditForm.tsx';
import useUserStore from './stores/useUserStore.ts';
import Recipes from './pages/recipes/Recipes.tsx';
import RecipeForm from './components/RecipeForm.tsx';
import RecipeDetail from './components/RecipeDetail.tsx';
import Share from './pages/share/Share.tsx';
import ShareForm from './components/ShareForm.tsx';
import ShareDetail from './components/ShareDetail.tsx';

const App = () => {
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
            <Route path='/' element={<Layout />}>
                <Route index path='/' element={<Home />} />
                <Route path='/login' element={!user ? <Login /> : <Navigate to='/' replace={true} />} />
                <Route path='/signup' element={!user ? <SignUp /> : <Navigate to='/' replace={true} />} />
                <Route path='/mypage' element={!user ? <Login /> : <Mypage />} />
                <Route path='/mypage/edit' element={!user ? <Login /> : <ProfileEditForm />} />
                <Route path='/recipes' element={<Recipes />} />
                <Route path='/recipes/form' element={<RecipeForm />} />
                <Route path='/recipes/:id' element={<RecipeDetail />} />
                <Route path='/share' element={<Share />} />
                <Route path='/share/form' element={<ShareForm />} />
                <Route path='/share/:id' element={<ShareDetail />} />
            </Route>
        </Routes>
    );
};

export default App;
