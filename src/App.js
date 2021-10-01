import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Header from './components/nav/Header';
import RegisterComplete from './pages/auth/RegisterComplete';
import { currentUser } from './functions/auth';

import { auth } from './firebase';
import { useDispatch } from 'react-redux';
import ForgotPassword from './pages/auth/ForgotPassword';
import History from './pages/user/History';
import UserRoute from './components/routes/UserRoute';
import Password from './pages/user/Password';
import Wishlist from './pages/user/Wishlist';
import AdminRoute from './components/routes/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import CategoryCreate from './pages/admin/category/CategoryCreate';
import CategoryUpdate from './pages/admin/category/CategoryUpdate';
import SubcategoryCreate from './pages/admin/subcategory/SubcategoryCreate';
import SubcategoryUpdate from './pages/admin/subcategory/SubcategoryUpdate';
import ProductCreate from './pages/admin/product/ProductCreate';
import AllProducts from './pages/admin/product/AllProducts';
import ProductUpdate from './pages/admin/product/ProductUpdate';
import Product from './pages/Product';
import CategoryHome from './pages/category/CategoryHome';
import SubcategoryHome from './pages/subcategory/SubcategoryHome';
import Shop from './pages/Shop';

const App = () => {
    const dispatch = useDispatch();

    // check firebase auth state
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const idTokenResult = await user.getIdTokenResult();

                currentUser(idTokenResult.token)
                    .then((res) => {
                        dispatch({
                            type: 'LOGGED_IN_USER',
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                token: idTokenResult.token,
                                role: res.data.role,
                                _id: res.data._id,
                            },
                        });
                    })
                    .catch((err) => console.log(err));
            }
        });
        // cleanup
        return () => unsubscribe();
    }, [dispatch]);

    return (
        <>
            <Header />
            <ToastContainer />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route
                    exact
                    path="/register/complete"
                    component={RegisterComplete}
                />
                <Route
                    exact
                    path="/forgot/password"
                    component={ForgotPassword}
                />
                <UserRoute exact path="/user/history" component={History} />
                <UserRoute exact path="/user/password" component={Password} />
                <UserRoute exact path="/user/wishlist" component={Wishlist} />
                <AdminRoute
                    exact
                    path="/admin/dashboard"
                    component={AdminDashboard}
                />
                <AdminRoute
                    exact
                    path="/admin/category"
                    component={CategoryCreate}
                />
                <AdminRoute
                    exact
                    path="/admin/category/:slug"
                    component={CategoryUpdate}
                />
                <AdminRoute
                    exact
                    path="/admin/subcategory"
                    component={SubcategoryCreate}
                />
                <AdminRoute
                    exact
                    path="/admin/subcategory/:slug"
                    component={SubcategoryUpdate}
                />
                <AdminRoute
                    exact
                    path="/admin/product"
                    component={ProductCreate}
                />
                <AdminRoute
                    exact
                    path="/admin/products"
                    component={AllProducts}
                />
                <AdminRoute
                    exact
                    path="/admin/product/:slug"
                    component={ProductUpdate}
                />
                <Route exact path="/product/:slug" component={Product} />
                <Route exact path="/category/:slug" component={CategoryHome} />
                <Route
                    exact
                    path="/subcategory/:slug"
                    component={SubcategoryHome}
                />
                <Route exact path="/shop" component={Shop} />
            </Switch>
        </>
    );
};

export default App;
