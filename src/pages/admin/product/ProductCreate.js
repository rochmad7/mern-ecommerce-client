import React, { useEffect, useState } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { createProduct } from '../../../functions/product';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ProductCreateForm from '../../../components/forms/ProductCreateForm';
import { getCategories, getSubcategories } from '../../../functions/category';
import FileUpload from '../../../components/forms/FileUpload';
import { LoadingOutlined } from '@ant-design/icons';

const initialState = {
    title: '',
    description: '',
    price: '',
    categories: [],
    category: '',
    subcategories: [],
    shipping: '',
    quantity: '',
    images: [],
    colors: ['Black', 'White', 'Red', 'Green', 'Blue'],
    brands: ['Apple', 'Microsoft', 'Asus', 'Xiaomi'],
    color: '',
    brand: '',
};
const ProductCreate = () => {
    const [values, setValues] = useState(initialState);
    const [subcategoryOptions, setSubcategoryOptions] = useState([]);
    const [showSubcategory, setShowSubcategory] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () =>
        getCategories().then((category) =>
            setValues({ ...values, categories: category.data })
        );

    const handleSubmit = (e) => {
        e.preventDefault();
        createProduct(values, user.token)
            .then((res) => {
                console.log(res);
                // toast.success('Product created successfully');
                window.alert(`${res.data.title} has been created`);
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
                // if (err.response.status === 400) toast.error(err.response.data);
                toast.error(err.response.data.err);
            });
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (e) => {
        e.preventDefault();
        setValues({ ...values, subcategories: [], category: e.target.value });
        getSubcategories(e.target.value).then((res) => {
            console.log(res);
            setSubcategoryOptions(res.data);
        });
        setShowSubcategory(true);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    {loading ? (
                        <LoadingOutlined className="text-danger h1" />
                    ) : (
                        <h4>Create Product</h4>
                    )}
                    <hr />
                    <div className="p-3">
                        {' '}
                        <FileUpload
                            values={values}
                            setValues={setValues}
                            setLoading={setLoading}
                        />
                    </div>
                    <ProductCreateForm
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        handleCategoryChange={handleCategoryChange}
                        subcategoryOptions={subcategoryOptions}
                        showSubcategory={showSubcategory}
                        values={values}
                        setValues={setValues}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductCreate;
