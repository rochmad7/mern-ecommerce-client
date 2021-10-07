import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCardInCheckout from '../components/cards/ProductCardInCheckout';
import { userCart } from '../functions/user';

const Cart = ({ history }) => {
    const { cart, user } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();

    const getTotal = () => {
        return cart.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };

    const saveOrderToDB = () => {
        userCart(cart, user.token)
            .then((res) => {
                if (res.data.ok) history.push('/checkout');
            })
            .catch((err) => console.log('save cart', err));
    };

    const saveCashOrderToDB = () => {
        dispatch({
            type: 'COD',
            payload: true,
        });
        userCart(cart, user.token)
            .then((res) => {
                if (res.data.ok) history.push('/checkout');
            })
            .catch((err) => console.log('save cart', err));
    };

    const showCartItems = () => {
        return (
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Image</th>
                        <th scope="col">Title</th>
                        <th scope="col">Price</th>
                        <th scope="col">Brand</th>
                        <th scope="col">Color</th>
                        <th scope="col">Count</th>
                        <th scope="col">Shipping</th>
                        <th scope="col">Remove</th>
                    </tr>
                </thead>
                {cart.map((product) => (
                    <ProductCardInCheckout
                        key={product._id}
                        product={product}
                    />
                ))}
            </table>
        );
    };

    return (
        <div className="container-fluid pt-2">
            <div className="row">
                <div className="col-md-8">
                    <h4>Cart - {cart.length} products</h4>
                    {!cart.length ? (
                        <p>No products in cart</p>
                    ) : (
                        showCartItems()
                    )}
                </div>
                <div className="col-md-4">
                    <h4>Order Summary</h4>
                    <hr />
                    <p>Products</p>
                    {cart.map((c, i) => (
                        <div key={i}>
                            <p>
                                {c.title} x {c.count} = ${c.price * c.count}
                            </p>
                        </div>
                    ))}
                    <hr />
                    Total: <b>${getTotal()}</b>
                    <hr />
                    {user ? (
                        <>
                            <button
                                onClick={saveOrderToDB}
                                className="btn btn-sm btn-primary mt-2"
                                disabled={!cart.length}
                            >
                                Proceed to Checkout
                            </button>
                            <br />
                            <button
                                onClick={saveCashOrderToDB}
                                className="btn btn-sm btn-success mt-3"
                                disabled={!cart.length}
                            >
                                Cash on Delivery
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-sm btn-dark mt-2">
                            <Link
                                to={{
                                    pathname: '/login',
                                    state: { from: 'cart' },
                                }}
                            >
                                Login to Checkout
                            </Link>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
