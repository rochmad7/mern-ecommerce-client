import React from 'react';
import { Card } from 'antd';
// import defaultImage from '../../images/default.png';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const AdminProductCard = ({ product, handleRemove }) => {
    const { title, description, images, slug } = product;

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
                <Link to={`/admin/product/${slug}`}>
                    {' '}
                    <EditOutlined className="text-warning" />
                </Link>,
                <DeleteOutlined
                    onClick={() => handleRemove(slug)}
                    className="text-danger"
                />,
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

export default AdminProductCard;
