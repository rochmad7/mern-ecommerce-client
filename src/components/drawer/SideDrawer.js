import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer } from 'antd';
import { Link } from 'react-router-dom';

const SideDrawer = () => {
    const dispatch = useDispatch();
    const { drawer, cart } = useSelector((state) => ({ ...state }));

    const imageStyles = {
        width: '100%',
        height: '100px',
        objectFit: 'cover',
    };

    return (
        <Drawer
            className="text-center"
            title={`Cart - ${cart.length} products`}
            visible={drawer}
            onClose={() =>
                dispatch({
                    type: 'SET_VISIBLE',
                    payload: false,
                })
            }
        >
            {cart.map((product) => (
                <div className="row" key={product._id}>
                    <div className="col">
                        {product.images[0] ? (
                            <>
                                <img
                                    src={product.images[0].url}
                                    alt=""
                                    style={imageStyles}
                                />
                                <p className="text-center bg-secondary text-light">
                                    {product.title} x {product.count}
                                </p>
                            </>
                        ) : (
                            <>
                                <img
                                    src="https://res.cloudinary.com/rochmad7/image/upload/v1631665297/sample.jpg"
                                    alt=""
                                    style={imageStyles}
                                />
                                <p className="text-center bg-secondary text-light">
                                    {product.title} x {product.count}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            ))}

            <Link to="/cart">
                <button
                    className="btn btn-primary text-center"
                    onClick={() =>
                        dispatch({
                            type: 'SET_VISIBLE',
                            payload: false,
                        })
                    }
                >
                    Go to Cart
                </button>
            </Link>
        </Drawer>
    );
};

export default SideDrawer;
