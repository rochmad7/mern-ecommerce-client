import React, { useState } from 'react';
import { Card, Tabs, Tooltip } from 'antd';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import ProductListItems from './ProductListItems';
import RatingModal from '../modal/RatingModal';
import { showAverage } from '../../functions/rating';
import StarRatings from 'react-star-ratings';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { addToWishlist } from '../../functions/user';
import { toast } from 'react-toastify';

const { TabPane } = Tabs;

const SingleProduct = ({ product, onStarClick, star }) => {
    const { title, images, description, _id } = product;
    const [tooltip, setTooltip] = useState('Click to add product to cart');

    const dispatch = useDispatch();
    const { user, cart } = useSelector((state) => ({ ...state }));

    let history = useHistory();

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

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        addToWishlist(product._id, user.token).then((res) => {
            console.log('Added to wishlist', res.data);
            toast.success('Added to wishlist');
            history.push('/user/wishlist');
        });
    };

    return (
        <>
            <div className="col-md-7">
                {images && images.length ? (
                    <Carousel autoPlay infiniteLoop>
                        {images &&
                            images.map((image) => (
                                <img
                                    src={image.url}
                                    key={image.public_id}
                                    alt=""
                                />
                            ))}
                    </Carousel>
                ) : (
                    <Card
                        cover={
                            <img
                                src={
                                    images && images.length
                                        ? images[0].url
                                        : 'https://res.cloudinary.com/rochmad7/image/upload/v1631665297/sample.jpg'
                                }
                                alt=""
                                className="mb-3 card-image"
                            />
                        }
                    />
                )}

                <Tabs type="card">
                    <TabPane tab="Description" key="1">
                        {description && description}
                    </TabPane>
                    <TabPane tab="More" key="2">
                        More
                    </TabPane>
                </Tabs>
            </div>
            <div className="col-md-5">
                <h1 className="bg-info p-3">{title}</h1>
                {product && product.ratings && product.ratings.length > 0 ? (
                    showAverage(product)
                ) : (
                    <div className="text-center">No ratings yet</div>
                )}
                <Card
                    actions={[
                        <Tooltip title={tooltip}>
                            <a onClick={handleAddToCart}>
                                <ShoppingCartOutlined className="text-danger" />{' '}
                                <br /> Add to Cart
                            </a>
                        </Tooltip>,
                        <a onClick={handleAddToWishlist}>
                            <HeartOutlined className="text-info" />
                            <br />
                            Add to Wishlist
                        </a>,
                        <RatingModal>
                            <StarRatings
                                name={_id}
                                numberOfStars={5}
                                rating={star}
                                changeRating={onStarClick}
                                isSelectable={true}
                                starRatedColor="red"
                            />
                            {/*<Rating*/}
                            {/*    onClick={() => onStarClick(_id, star)}*/}
                            {/*    ratingValue={star}*/}
                            {/*    fillColor="red"*/}
                            {/*/>*/}
                            {/*<Rate*/}
                            {/*    value={star}*/}
                            {/*    allowHalf={true}*/}
                            {/*    onChange={(value) => onStarClick(value, _id)}*/}
                            {/*/>*/}
                        </RatingModal>,
                    ]}
                >
                    <ProductListItems product={product} />
                </Card>
            </div>
        </>
    );
};

export default SingleProduct;
