import React, { useEffect, useState } from 'react';
import { getProductsByCount, removeProduct } from '../../../functions/product';
import AdminNav from '../../../components/nav/AdminNav';
import AdminProductCard from '../../../components/cards/AdminProductCard';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadAllProducts();
    }, []);

    function loadAllProducts() {
        setLoading(true);
        getProductsByCount(100)
            .then((res) => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }

    const handleRemove = (slug) => {
        let answer = 'Are you sure you want to remove?';
        if (window.confirm(answer)) {
            removeProduct(slug, user.token)
                .then((res) => {
                    loadAllProducts();
                    toast.success(`${res.data.title} has been removed`);
                })
                .catch((err) => {
                    if (err.response.status === 400)
                        toast.error(err.response.data);
                    console.log(err);
                });
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4>All Products</h4>
                    )}
                    <div className="row">
                        {products.map((product) => (
                            <div key={product._id} className="col-md-4 pb-3">
                                {' '}
                                <AdminProductCard
                                    product={product}
                                    handleRemove={handleRemove}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllProducts;
