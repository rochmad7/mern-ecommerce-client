import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const ProductCreateForm = ({
    handleChange,
    handleSubmit,
    handleCategoryChange,
    subcategoryOptions,
    showSubcategory,
    values,
    setValues,
}) => {
    const {
        title,
        description,
        price,
        categories,
        category,
        subcategories,
        shipping,
        quantity,
        images,
        brands,
        colors,
        color,
        brand,
    } = values;

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={title}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={description}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Price</label>
                <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={price}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Shipping</label>
                <select
                    name="shipping"
                    className="form-control"
                    onChange={handleChange}
                >
                    {' '}
                    <option>Select shipping</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>
            </div>
            <div className="form-group">
                <label>Quantity</label>
                <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    value={quantity}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Color</label>
                <select
                    name="color"
                    className="form-control"
                    onChange={handleChange}
                >
                    <option>Select color</option>
                    {colors.map((color) => (
                        <option key={color} value={color}>
                            {color}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Brand</label>
                <select
                    name="brand"
                    className="form-control"
                    onChange={handleChange}
                >
                    <option>Select brand</option>
                    {brands.map((brand) => (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Category</label>
                <select
                    name="category"
                    className="form-control"
                    onChange={handleCategoryChange}
                >
                    <option>Select Category</option>
                    {categories.length > 0 &&
                        categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                </select>
            </div>
            {showSubcategory && (
                <div>
                    <label htmlFor="subcategories">Sub Categories</label>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select sub categories"
                        value={subcategories}
                        onChange={(value) =>
                            setValues({ ...values, subcategories: value })
                        }
                    >
                        {subcategoryOptions.length &&
                            subcategoryOptions.map((subcategory) => (
                                <Option
                                    key={subcategory._id}
                                    value={subcategory._id}
                                >
                                    {subcategory.name}
                                </Option>
                            ))}
                    </Select>
                </div>
            )}
            <br />
            <button className="btn btn-outline-info">Save</button>
        </form>
    );
};

export default ProductCreateForm;
