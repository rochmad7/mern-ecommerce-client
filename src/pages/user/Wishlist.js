import React, { useEffect, useState } from 'react';
import UserNav from '../../components/nav/UserNav';
import { useSelector } from 'react-redux';
import { getWishlist, removeWishlist } from '../../functions/user';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = () =>
        getWishlist(user.token).then((res) => {
            // console.log(res.data);
            setWishlist(res.data.wishlist);
        });

    const handleRemove = (productId) =>
        removeWishlist(productId, user.token).then((res) => {
            loadWishlist();
        });

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col">
                    <h4>Wishlist</h4>
                    {wishlist.map((product) => (
                        <div
                            key={product._id}
                            className="alert alert-secondary"
                        >
                            <Link to={`/product/${product.slug}`}>
                                {product.title}
                            </Link>
                            <span
                                onClick={() => handleRemove(product._id)}
                                className="btn btn-sm float-end"
                            >
                                <DeleteOutlined className="text-danger" />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
