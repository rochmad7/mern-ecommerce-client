import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    applyCoupon,
    createCashOrderForUser,
    emptyUserCart,
    getUserCart,
    saveUserAddress,
} from '../functions/user';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Checkout = ({ history }) => {
    const dispatch = useDispatch();
    const { user, COD } = useSelector((state) => ({ ...state }));
    const couponStatus = useSelector((state) => state.coupon);

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState('');
    const [addressSaved, setAddressSaved] = useState(false);
    const [coupon, setCoupon] = useState('');
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [discountError, setDiscountError] = useState('');

    useEffect(() => {
        getUserCart(user.token).then((res) => {
            console.log(res.data);
            setProducts(res.data.products);
            setTotal(res.data.cartTotal);
        });
    }, []);

    const saveAddressToDB = () => {
        saveUserAddress(address, user.token).then((res) => {
            if (res.data.ok) {
                setAddressSaved(true);
                toast.success('Address is saved');
            }
        });
    };

    const emptyCart = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cart');
        }
        dispatch({
            type: 'ADD_TO_CART',
            payload: [],
        });
        emptyUserCart(user.token).then(() => {
            setProducts([]);
            setTotal(0);
            setTotalAfterDiscount(0);
            setCoupon('');
            toast.success('Cart is emptied');
        });
    };

    const applyDiscount = () => {
        applyCoupon(coupon, user.token).then((res) => {
            if (res.data) {
                setTotalAfterDiscount(res.data);
                dispatch({
                    type: 'COUPON_APPLIED',
                    payload: true,
                });
            }
            if (res.data.err) {
                setDiscountError(res.data.err);
                dispatch({
                    type: 'COUPON_APPLIED',
                    payload: false,
                });
            }
        });
    };

    const showAddress = () => (
        <>
            <ReactQuill theme="snow" value={address} onChange={setAddress} />
            <button className="btn btn-primary mt-2" onClick={saveAddressToDB}>
                Save
            </button>
        </>
    );

    const showProductSummary = () =>
        products.map((p, i) => (
            <div key={i}>
                <p>
                    {p.product.title} ({p.color}) x {p.count} ={' '}
                    {p.product.price * p.count}
                </p>
            </div>
        ));

    const showApplyCoupon = () => (
        <>
            <input
                onChange={(e) => {
                    setCoupon(e.target.value);
                    setDiscountError('');
                }}
                type="text"
                value={coupon}
                className="form-control"
            />
            <button onClick={applyDiscount} className="btn btn-primary">
                Apply
            </button>
        </>
    );

    const createCashOrder = () => {
        createCashOrderForUser(COD, couponStatus, user.token).then((res) => {
            console.log('COD', res);
            if (res.data.ok) {
                if (typeof window !== 'undefined')
                    localStorage.removeItem('cart');

                dispatch({
                    type: 'ADD_TO_CART',
                    payload: [],
                });

                dispatch({
                    type: 'COUPON_APPLIED',
                    payload: false,
                });

                dispatch({
                    type: 'COD',
                    payload: false,
                });

                emptyUserCart(user.token);

                setTimeout(() => {
                    history.push('/user/history');
                }, 1000);
            }
        });
    };

    return (
        <div className="row">
            <div className="col-md-6">
                <h4>Delivery Address</h4>
                <br />
                <br />
                {showAddress()}
                <hr />
                <h4>Have coupon?</h4>
                <br />
                {showApplyCoupon()}
                <hr />
                {discountError && (
                    <p className="bg-danger mt-2">{discountError}</p>
                )}
            </div>
            <div className="col-md-6">
                <h4>Order Summary</h4>
                <hr />
                <p>Products - {products.length} items</p>
                <hr />
                {showProductSummary()}
                <hr />
                <p>Cart Total: ${total}</p>
                {totalAfterDiscount > 0 && (
                    <p className="bg-success mt-2">
                        Total after discounted:{' '}
                        <strong>${totalAfterDiscount}</strong>
                    </p>
                )}
                <div className="row">
                    <div className="col-md-6">
                        {COD ? (
                            <button
                                className="btn btn-primary"
                                disabled={!addressSaved || !products.length}
                                onClick={createCashOrder}
                            >
                                Place Order
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary"
                                disabled={!addressSaved || !products.length}
                                onClick={() => history.push('/payment')}
                            >
                                Place Order
                            </button>
                        )}
                    </div>
                    <div className="col-md-6">
                        <button
                            className="btn btn-primary"
                            onClick={emptyCart}
                            disabled={!products.length}
                        >
                            Empty Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
