import React, { useEffect, useState } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { getProduct, updateProduct } from '../../../functions/product';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getCategories, getSubcategories } from '../../../functions/category';
import FileUpload from '../../../components/forms/FileUpload';
import { LoadingOutlined } from '@ant-design/icons';
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm';

const initialState = {
    title: '',
    description: '',
    price: '',
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

const ProductUpdate = ({ match, history }) => {
    const [values, setValues] = useState(initialState);
    const [subcategoryOptions, setSubcategoryOptions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [arrayOfSubcategories, setArrayOfSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));
    const { slug } = match.params;

    useEffect(() => {
        loadProduct();
        loadCategories();
    }, []);

    const loadProduct = () => {
        getProduct(slug).then((product) => {
            setValues({ ...values, ...product.data });
            getSubcategories(product.data.category._id).then((res) =>
                setSubcategoryOptions(res.data)
            );
            let arr = [];
            product.data.subcategories.map((subcategory) => {
                arr.push(subcategory._id);
            });
            // console.log(arr);
            setArrayOfSubcategories(arr);
        });
    };

    const loadCategories = () =>
        getCategories().then((category) => setCategories(category.data));

    const handleCategoryChange = (e) => {
        e.preventDefault();
        setValues({ ...values, subcategories: [] });
        setSelectedCategory(e.target.value);

        getSubcategories(e.target.value).then((res) => {
            console.log(res);
            setSubcategoryOptions(res.data);
        });

        if (values.category._id === e.target.value) {
            loadProduct();
        }

        setArrayOfSubcategories([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        values.subcategories = arrayOfSubcategories;
        values.category = selectedCategory ? selectedCategory : values.category;

        updateProduct(slug, values, user.token)
            .then((res) => {
                setLoading(false);
                toast.success(`${res.data.title} has been updated`);
                history.push('/admin/product');
            })
            .catch((err) => {
                setLoading(false);
                // if (err.response.status === 400) toast.error(err.response.data);
                toast.error(err.response.data.err);
            });
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    {/*{JSON.stringify(values)}*/}
                    {loading ? (
                        <LoadingOutlined className="text-danger h1" />
                    ) : (
                        <h4>Update Product</h4>
                    )}

                    <div className="p-3">
                        {' '}
                        <FileUpload
                            values={values}
                            setValues={setValues}
                            setLoading={setLoading}
                        />
                    </div>
                    <ProductUpdateForm
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        handleCategoryChange={handleCategoryChange}
                        values={values}
                        setValues={setValues}
                        categories={categories}
                        arrayOfSubcategories={arrayOfSubcategories}
                        subcategoryOptions={subcategoryOptions}
                        setArrayOfSubcategories={setArrayOfSubcategories}
                        selectedCategory={selectedCategory}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductUpdate;
