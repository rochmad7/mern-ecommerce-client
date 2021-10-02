import React, { useState } from 'react';
import { Card, Tooltip } from 'antd';
import Meta from 'antd/es/card/Meta';
import { Link } from 'react-router-dom';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { showAverage } from '../../functions/rating';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

const ProductCard = ({ product }) => {
    const { images, title, description, slug, price } = product;
    const [tooltip, setTooltip] = useState('Click to add product to cart');

    const dispatch = useDispatch();
    const { user, cart } = useSelector((state) => ({ ...state }));

    const handleAddToCart = () => {
        let cart = [];
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            cart.push({
                ...product,
                count: 1,
            });
            let unique = _.uniqWith(cart, _.isEqual);

            localStorage.setItem('cart', JSON.stringify(unique));
            setTooltip('Added in cart');

            dispatch({
                type: 'ADD_TO_CART',
                payload: unique,
            });
            dispatch({
                type: 'SET_VISIBLE',
                payload: true,
            });
        }
    };

    return (
        <>
            {product && product.ratings && product.ratings.length > 0 ? (
                showAverage(product)
            ) : (
                <div className="text-center">No ratings yet</div>
            )}
            <Card
                cover={
                    <img
                        src={
                            images && images.length
                                ? images[0].url
                                : 'https://res.cloudinary.com/rochmad7/image/upload/v1631665297/sample.jpg'
                        }
                        alt=""
                        style={{ height: 240, objectFit: 'cover' }}
                        className="p-1"
                    />
                }
                actions={[
                    <Link to={`/product/${slug}`}>
                        {' '}
                        <EyeOutlined className="text-warning" /> <br /> View
                        Product
                    </Link>,
                    <Tooltip title={tooltip}>
                        <a onClick={handleAddToCart}>
                            <ShoppingCartOutlined className="text-danger" />{' '}
                            <br /> Add to Cart
                        </a>
                    </Tooltip>,
                ]}
            >
                <Meta
                    title={`${title} - $${price}`}
                    description={`${
                        description && description.substring(0, 90)
                    }...`}
                />
            </Card>
        </>
    );
};

export default ProductCard;
