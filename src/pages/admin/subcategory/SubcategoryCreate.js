import React, { useEffect, useState } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { useSelector } from 'react-redux';
import { getCategories } from '../../../functions/category';
import { toast } from 'react-toastify';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';
import {
    createSubcategory,
    getSubcategories,
    removeSubcategory,
} from '../../../functions/subcategory';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const SubcategoryCreate = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [subcategories, setSubcategories] = useState([]);

    const { user } = useSelector((state) => ({ ...state }));

    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        loadCategories();
        loadSubcategories();
    }, []);

    const loadCategories = () =>
        getCategories().then((category) => setCategories(category.data));

    const loadSubcategories = () =>
        getSubcategories().then((subcategory) =>
            setSubcategories(subcategory.data)
        );

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        createSubcategory({ name, parent: category }, user.token)
            .then((res) => {
                setLoading(false);
                setName('');
                toast.success(`${res.data.name} has been created`);
                loadSubcategories();
            })
            .catch((err) => {
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data);
            });
    };

    const handleRemove = async (slug) => {
        if (window.confirm('Are you sure you want to remove this?')) {
            setLoading(true);
            removeSubcategory(slug, user.token)
                .then((res) => {
                    setLoading(false);
                    toast.success(res.data);
                    loadSubcategories();
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
                        <h4>Create Subcategory</h4>
                    )}

                    <div className="form-group">
                        <label>Parent Category</label>
                        <select
                            name="category"
                            className="form-control"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option>Select Category</option>
                            {categories.length > 0 &&
                                categories.map((category) => (
                                    <option
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <CategoryForm
                        handleSubmit={handleSubmit}
                        name={name}
                        setName={setName}
                    />
                    <br />
                    <LocalSearch keyword={keyword} setKeyword={setKeyword} />
                    {subcategories
                        .filter(searchCategories(keyword))
                        .map((subcategory) => (
                            <div
                                className="alert alert-info"
                                key={subcategory._id}
                            >
                                {subcategory.name}{' '}
                                <span
                                    onClick={() =>
                                        handleRemove(subcategory.slug)
                                    }
                                    className="btn btn-sm float-end"
                                >
                                    <DeleteOutlined className="text-danger" />
                                </span>{' '}
                                <Link
                                    to={`/admin/subcategory/${subcategory.slug}`}
                                >
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

export default SubcategoryCreate;
