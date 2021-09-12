import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { createOrUpdateUser } from '../../functions/auth';

const RegisterComplete = ({ history }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // const { user } = useSelector((state) => ({ ...state }));

    let dispatch = useDispatch();

    useEffect(() => {
        setEmail(window.localStorage.getItem('emailForRegistration'));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // validation
        if (!email || !password) {
            toast.error('Email and password is required');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            const result = await auth.signInWithEmailLink(
                email,
                window.location.href,
            );
            // console.log(result);
            if (result.user.emailVerified) {
                // remove user email from localstorage
                window.localStorage.removeItem('emailForRegistration');
                // get user id token
                let user = auth.currentUser;
                await user.updatePassword(password);
                const idTokenResult = await user.getIdTokenResult();
                console.log(user, idTokenResult);
                //redux store
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
                    })
                    .catch(err => console.log(err));

                // redirect
                history.push('/');
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    };

    const completeRegistrationForm = () => (
        <form onSubmit={handleSubmit}>
            <input
                type='email'
                name='email'
                value={email}
                className='form-control'
                disabled
            />
            <br />
            <input
                type='password'
                name='password'
                value={password}
                className='form-control'
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                placeholder='Enter your password'
            />
            <button type='submit' className='btn btn-raised'>
                Complete Registration
            </button>
        </form>
    );

    return (
        <div className='container p-5'>
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <h4>Register Complete</h4>
                    {completeRegistrationForm()}
                </div>
            </div>
        </div>
    );
};

export default RegisterComplete;
