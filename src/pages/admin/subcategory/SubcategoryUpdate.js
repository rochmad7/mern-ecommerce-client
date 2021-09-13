import React, { useEffect, useState } from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { useSelector } from 'react-redux';
import { getCategories } from '../../../functions/category';
import { toast } from 'react-toastify';
import CategoryForm from '../../../components/forms/CategoryForm';
import { getSubcategory, updateSubcategory } from '../../../functions/subcategory';

const SubcategoryUpdate = ({ match, history }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [parent, setParent] = useState('');

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadCategories();
        loadSubcategory();
    }, []);

    const loadCategories = () =>
        getCategories().then((category) => setCategories(category.data));

    const loadSubcategory = () =>
        getSubcategory(match.params.slug).then((subcategory) => {
            setName(subcategory.data.name);
            setParent(subcategory.data.parent);
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        updateSubcategory(match.params.slug, { name, parent }, user.token)
            .then((res) => {
                setLoading(false);
                setName('');
                toast.success(`${res.data.name} has been updated`);
                history.push('/admin/subcategory');
            })
            .catch((err) => {
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data);
            });
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-2'>
                    <AdminNav />
                </div>
                <div className='col'>
                    {loading ? (
                        <h4 className='text-danger'>Loading...</h4>
                    ) : (
                        <h4>Update Subcategory</h4>
                    )}

                    <div className='form-group'>
                        <label>Parent Category</label>
                        <select
                            name='category'
                            className='form-control'
                            onChange={(e) => setParent(e.target.value)}
                        >
                            <option>Select Category</option>
                            {categories.length > 0 &&
                            categories.map((category) => (
                                <option
                                    key={category._id}
                                    value={category._id}
                                    selected={category._id === parent}
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
                </div>
            </div>
        </div>
    );
};

export default SubcategoryUpdate;
