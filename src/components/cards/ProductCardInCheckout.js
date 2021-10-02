import React from 'react';
import ModalImage from 'react-modal-image';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    CloseOutlined,
} from '@ant-design/icons';

const ProductCardInCheckout = ({ product }) => {
    const colors = ['Black', 'White', 'Red', 'Green', 'Blue'];

    let dispatch = useDispatch();

    const handleColorChange = (e) => {
        let cart = [];

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            cart.map((p, i) => {
                if (product._id === p._id) {
                    cart[i].color = e.target.value;
                }
            });

            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: 'ADD_TO_CART',
                payload: cart,
            });
        }
    };

    const handleQuantityChange = (e) => {
        let count = e.target.value < 1 ? 1 : e.target.value;

        if (count > product.quantity) {
            toast.error(`Maximum available quantity is ${product.quantity}`);
            return;
        }

        let cart = [];

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            cart.map((p, i) => {
                if (p._id === product._id) {
                    cart[i].count = count;
                }
            });

            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: 'ADD_TO_CART',
                payload: cart,
            });
        }
    };

    const handleRemove = () => {
        let cart = [];

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            cart.map((p, i) => {
                if (p._id === product._id) {
                    cart.splice(i, 1);
                }
            });

            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: 'ADD_TO_CART',
                payload: cart,
            });
        }
    };

    return (
        <tbody>
            <tr>
                <td>
                    <div style={{ width: '100px', height: 'auto' }}>
                        {product.images.length ? (
                            <ModalImage
                                small={product.images[0].url}
                                large={product.images[0].url}
                            />
                        ) : (
                            <ModalImage
                                small="https://res.cloudinary.com/rochmad7/image/upload/v1631665297/sample.jpg"
                                large="https://res.cloudinary.com/rochmad7/image/upload/v1631665297/sample.jpg"
                            />
                        )}
                    </div>
                </td>
                <td>{product.title}</td>
                <td>${product.price}</td>
                <td>{product.brand}</td>
                <td>
                    <select
                        onChange={handleColorChange}
                        name="color"
                        id="color"
                        className="form-control"
                    >
                        {product.color ? (
                            <option value={product.color}>
                                {product.color}
                            </option>
                        ) : (
                            <option>Select</option>
                        )}
                        {colors
                            .filter((color) => color !== product.color)
                            .map((color) => (
                                <option value={color} key={color}>
                                    {color}
                                </option>
                            ))}
                    </select>
                </td>
                <td>
                    <input
                        type="number"
                        className="form-control"
                        value={product.count}
                        onChange={handleQuantityChange}
                    />
                </td>
                <td>
                    {product.shipping === 'Yes' ? (
                        <CheckCircleOutlined className="text-success" />
                    ) : (
                        <CloseCircleOutlined className="text-danger" />
                    )}
                </td>
                <td>
                    <CloseOutlined
                        onClick={handleRemove}
                        className="text-danger"
                    />
                </td>
            </tr>
        </tbody>
    );
};

export default ProductCardInCheckout;
