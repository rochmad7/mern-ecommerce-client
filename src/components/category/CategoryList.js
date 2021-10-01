import React, { useEffect, useState } from 'react';
import { getCategories } from '../../functions/category';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getCategories().then((res) => {
            setCategories(res.data);
            setLoading(false);
            // console.log(categories);
        });
    }, []);

    const showCategories = () => {
        return categories.map((category) => (
            <Button
                type="primary"
                className="col m-3"
                size="large"
                key={category._id}
            >
                <Link to={`/category/${category.slug}`}>{category.name}</Link>
            </Button>
        ));
    };

    return (
        <div className="container">
            <div className="row">
                {loading ? (
                    <h4 className="text-center">Loading...</h4>
                ) : (
                    showCategories()
                )}
            </div>
        </div>
    );
};

export default CategoryList;
