import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSubcategories } from '../../functions/subcategory';
import { Button } from 'antd';

const SubcategoryList = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getSubcategories().then((res) => {
            setSubcategories(res.data);
            setLoading(false);
            // console.log(categories);
        });
    }, []);

    const showSubcategories = () => {
        return subcategories.map((subcategory) => (
            <Button
                type="primary"
                className="col m-3"
                size="large"
                key={subcategory._id}
            >
                <Link to={`/subcategory/${subcategory.slug}`}>
                    {subcategory.name}
                </Link>
            </Button>
        ));
    };

    return (
        <div className="container">
            <div className="row">
                {loading ? (
                    <h4 className="text-center">Loading...</h4>
                ) : (
                    showSubcategories()
                )}
            </div>
        </div>
    );
};

export default SubcategoryList;
