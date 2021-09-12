import React, { useEffect, useState } from 'react';
import { auth, googleAuthProvider } from '../../firebase';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { GoogleOutlined, MailOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrUpdateUser } from '../../functions/auth';

const Login = ({ history }) => {
    const [email, setEmail] = useState('rochmad.wa@gmail.com');
    const [password, setPassword] = useState('123456');
    const [loading, setLoading] = useState(false);

    let dispatch = useDispatch();
    const { user } = useSelector((state) => ({ ...state }));

    const roleBaseRedirect = (res) => {
        if (res.data.role === 'admin') history.push('/admin/dashboard');
        else history.push('/user/history');
    };

    useEffect(() => {
        if (user && user.token) history.push('/');
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await auth.signInWithEmailAndPassword(
                email,
                password
            );
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();

            createOrUpdateUser(idTokenResult.token)
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
                    roleBaseRedirect(res);
                })
                .catch((err) => console.log(err));

            // history.push('/');
        } catch (err) {
            console.log(err);
            toast.error(err.message);
            setLoading(false);
        }
    };

    const googleLogin = async () => {
        await auth
            .signInWithPopup(googleAuthProvider)
            .then(async (result) => {
                const { user } = result;
                const idTokenResult = await user.getIdTokenResult();
                createOrUpdateUser(idTokenResult.token)
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
                        roleBaseRedirect(res);
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.message);
            });
    };

    const loginForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="email"
                    name="email"
                    value={email}
                    className="form-control"
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    placeholder="Email"
                />
                <br />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    name="password"
                    value={password}
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <br />
                <Button
                    onClick={handleSubmit}
                    type="primary"
                    className="mb-btn"
                    block
                    shape="round"
                    icon={<MailOutlined />}
                    size="large"
                    disabled={!email || password.length < 6}
                >
                    Login with Email & Password
                </Button>
            </div>
        </form>
    );

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {loading ? (
                        <h4 className="text-danger">Loading</h4>
                    ) : (
                        <h4>Login</h4>
                    )}
                    {loginForm()}
                    <br />
                    <Button
                        onClick={googleLogin}
                        type="danger"
                        className="mb-btn"
                        block
                        shape="round"
                        icon={<GoogleOutlined />}
                        size="large"
                    >
                        Login with Google
                    </Button>
                    <br />
                    <Link to="/forgot/password">Forgot Password</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
