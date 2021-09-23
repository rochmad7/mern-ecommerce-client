import React from 'react';
import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import { Link } from 'react-router-dom';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const ProductCard = ({ product }) => {
    const { images, title, description, slug } = product;

    return (
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
                    <EyeOutlined className="text-warning" /> <br /> View Product
                </Link>,
                <>
                    <ShoppingCartOutlined className="text-danger" /> <br /> Add
                    to Cart
                </>,
            ]}
        >
            <Meta
                title={title}
                description={`${
                    description && description.substring(0, 90)
                }...`}
            />
        </Card>
    );
};

export default ProductCard;
