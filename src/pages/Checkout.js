import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { emptyUserCart, getUserCart, saveUserAddress } from '../functions/user';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Checkout = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => ({ ...state }));
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState('');
    const [addressSaved, setAddressSaved] = useState(false);

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
            toast.success('Cart is emptied');
        });
    };

    return (
        <div className="row">
            <div className="col-md-6">
                <h4>Delivery Address</h4>
                <br />
                <br />
                <ReactQuill
                    theme="snow"
                    value={address}
                    onChange={setAddress}
                />
                <button
                    className="btn btn-primary mt-2"
                    onClick={saveAddressToDB}
                >
                    Save
                </button>
                <hr />
                <h4>Have coupon?</h4>
                <br />
                coupon input
            </div>
            <div className="col-md-6">
                <h4>Order Summary</h4>
                <hr />
                <p>Products - {products.length} items</p>
                <hr />
                {products.map((p, i) => (
                    <div key={i}>
                        <p>
                            {p.product.title} ({p.color}) x {p.count} ={' '}
                            {p.product.price * p.count}
                        </p>
                    </div>
                ))}
                <hr />
                <p>Cart Total: ${total}</p>

                <div className="row">
                    <div className="col-md-6">
                        <button
                            className="btn btn-primary"
                            disabled={!addressSaved || !products.length}
                        >
                            Place Order
                        </button>
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
