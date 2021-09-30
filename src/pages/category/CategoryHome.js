import React, { useEffect, useState } from 'react';
import { getCategory } from '../../functions/category';
import ProductCard from '../../components/cards/ProductCard';

const CategoryHome = ({ match }) => {
    const [category, setCategory] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const { slug } = match.params;

    useEffect(() => {
        setLoading(true);
        getCategory(slug).then((res) => {
            setCategory(res.data.category);
            setProducts(res.data.products);
            setLoading(false);
        });
    }, [slug]);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    {loading ? (
                        <h4 className="text-center p-3 mt-5 mb-5 bg-info h1 font-weight-bold">
                            Loading...
                        </h4>
                    ) : (
                        <h4 className="text-center p-3 mt-5 mb-5 bg-info h1 font-weight-bold">
                            {products.length} Products in "{category.name}"{' '}
                            Category
                        </h4>
                    )}
                </div>
            </div>
            <div className="row">
                {products.map((product) => (
                    <div className="col md-4" key={product._id}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryHome;
