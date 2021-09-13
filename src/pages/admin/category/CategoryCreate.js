import React, { useEffect, useState } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import {
    createCategory,
    getCategories,
    removeCategory,
} from '../../../functions/category';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';

const CategoryCreate = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const { user } = useSelector((state) => ({ ...state }));

    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () =>
        getCategories().then((category) => setCategories(category.data));

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        createCategory({ name }, user.token)
            .then((res) => {
                setLoading(false);
                setName('');
                toast.success(`${res.data.name} has been created`);
                loadCategories();
            })
            .catch((err) => {
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data);
            });
    };

    const handleRemove = async (slug) => {
        if (window.confirm('Are you sure you want to remove this?')) {
            setLoading(true);
            removeCategory(slug, user.token)
                .then((res) => {
                    setLoading(false);
                    toast.success(res.data);
                    loadCategories();
                })
                .catch((err) => {
                    setLoading(false);
                    if (err.response.status === 400)
                        toast.error(err.response.data);
                });
        }
    };

    const searchCategories = (keyword) => (category) =>
        category.name.toLowerCase().includes(keyword);

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
                        <h4>Create category</h4>
                    )}

                    <CategoryForm
                        handleSubmit={handleSubmit}
                        name={name}
                        setName={setName}
                    />
                    <br />
                    <LocalSearch
                        keyword={keyword}
                        setKeyword={setKeyword}
                    />
                    {categories
                        .filter(searchCategories(keyword))
                        .map((category) => (
                            <div
                                className="alert alert-info"
                                key={category._id}
                            >
                                {category.name}{' '}
                                <span
                                    onClick={() => handleRemove(category.slug)}
                                    className="btn btn-sm float-end"
                                >
                                    <DeleteOutlined className="text-danger" />
                                </span>{' '}
                                <Link to={`/admin/category/${category.slug}`}>
                                    <span className="btn btn-sm float-end">
                                        <EditOutlined className="text-warning" />
                                    </span>{' '}
                                </Link>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryCreate;
