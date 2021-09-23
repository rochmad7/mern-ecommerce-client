import React from 'react';
import { Link } from 'react-router-dom';

const ProductListItems = ({ product }) => {
    const {
        price,
        category,
        subcategories,
        shipping,
        color,
        brand,
        sold,
        quantity,
    } = product;

    return (
        <ul className="list-group">
            <li className="list-group-item">
                Price <span className="float-end">${price}</span>
            </li>
            {category && (
                <li className="list-group-item">
                    Category{' '}
                    <Link
                        to={`/category/${category.slug}`}
                        className="float-end"
                    >
                        {category.name}
                    </Link>
                </li>
            )}
            {subcategories && (
                <li className="list-group-item">
                    Subcategories
                    {subcategories.map((subcategory) => (
                        <Link
                            to={`/subcategory/${subcategory.slug}`}
                            className="float-end"
                        >
                            &nbsp;{subcategory.name},
                        </Link>
                    ))}
                </li>
            )}
            <li className="list-group-item">
                Shipping <span className="float-end">{shipping}</span>
            </li>
            <li className="list-group-item">
                Color <span className="float-end">{color}</span>
            </li>
            <li className="list-group-item">
                Brand <span className="float-end">{brand}</span>
            </li>
            <li className="list-group-item">
                Available <span className="float-end">{quantity}</span>
            </li>
            <li className="list-group-item">
                Sold <span className="float-end">{sold}</span>
            </li>
        </ul>
    );
};

export default ProductListItems;
