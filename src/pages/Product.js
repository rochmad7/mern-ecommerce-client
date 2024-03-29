import React, { useEffect, useState } from 'react';
import {
    getProduct,
    getRelatedProducts,
    productStar,
} from '../functions/product';
import SingleProduct from '../components/cards/SingleProduct';
import { useSelector } from 'react-redux';
import ProductCard from '../components/cards/ProductCard';

const Product = ({ match }) => {
    const [product, setProduct] = useState({});
    const [related, setRelated] = useState([]);
    const [star, setStar] = useState(0);

    const { user } = useSelector((state) => ({ ...state }));
    const { slug } = match.params;

    useEffect(() => {
        loadSingleProduct();
    }, [slug]);

    useEffect(() => {
        if (product.ratings && user) {
            let existingRatingObject = product.ratings.find(
                (rating) => rating.postedBy.toString() === user._id.toString()
            );
            existingRatingObject && setStar(existingRatingObject.star);
        }
    });

    const loadSingleProduct = () => {
        getProduct(slug).then((res) => {
            setProduct(res.data);
            getRelatedProducts(res.data._id).then((res) =>
                setRelated(res.data)
            );
        });
    };

    const onStarClick = (newRating, name) => {
        setStar(newRating);
        // console.log(newRating, name);
        productStar(name, newRating, user.token).then(() => {
            loadSingleProduct();
        });
    };

    return (
        <div className="container-fluid">
            <div className="row pt-4">
                <SingleProduct
                    product={product}
                    onStarClick={onStarClick}
                    star={star}
                />
            </div>

            <div className="row">
                <div className="col text-center pt-5 pb-5">
                    <hr />
                    <h1>Related Products</h1>
                    <hr />
                </div>
            </div>

            <div className="row pb-5">
                {related.length ? (
                    related.map((r) => (
                        <div key={r._id} className="col-md-4">
                            <ProductCard product={r} />
                        </div>
                    ))
                ) : (
                    <div className="text-center col h3">No products found</div>
                )}
            </div>
        </div>
    );
};

export default Product;
