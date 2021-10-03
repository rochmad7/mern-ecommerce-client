import React, { useEffect, useState } from 'react';
import {
    fetchProductsByFilter,
    getProductsByCount,
} from '../functions/product';
import ProductCard from '../components/cards/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Menu, Radio, Slider } from 'antd';
import {
    BgColorsOutlined,
    DeliveredProcedureOutlined,
    DollarOutlined,
    DownSquareOutlined,
    FontColorsOutlined,
    StarOutlined,
} from '@ant-design/icons';
import { getCategories } from '../functions/category';
import Star from '../components/forms/Star';
import { getSubcategories } from '../functions/subcategory';

const { SubMenu } = Menu;

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0, 0]);
    const [ok, setOk] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [star, setStar] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [subcategory, setSubcategory] = useState('');
    const [brands, setBrands] = useState([
        'Apple',
        'Microsoft',
        'Asus',
        'Xiaomi',
    ]);
    const [brand, setBrand] = useState('');
    const [colors, setColors] = useState([
        'Black',
        'White',
        'Red',
        'Green',
        'Blue',
    ]);
    const [color, setColor] = useState('');
    const [shipping, setShipping] = useState('');

    let dispatch = useDispatch();
    let { search } = useSelector((state) => ({ ...state }));
    const { text } = search;

    useEffect(() => {
        loadAllProducts();
        getCategories().then((res) => setCategories(res.data));
        getSubcategories().then((res) => setSubcategories(res.data));
    }, []);

    const fetchProducts = (arg) => {
        fetchProductsByFilter(arg).then((res) => {
            setProducts(res.data);
        });
    };

    const loadAllProducts = () => {
        setLoading(true);
        getProductsByCount(12).then((res) => {
            setProducts(res.data);
            setLoading(false);
        });
    };

    useEffect(() => {
        const delayed = setTimeout(() => {
            fetchProducts({ query: text });
            if (!text) {
                loadAllProducts();
            }
        }, 300);
        return () => clearTimeout(delayed);
    }, [text]);

    useEffect(() => {
        fetchProducts({ price });
    }, [ok]);

    const handleSlider = (value) => {
        // Reset other filters
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' },
        });
        setCategoryIds([]);
        setStar('');
        setSubcategory('');
        setBrand('');
        setColor('');
        setShipping('');
        setPrice(value);
        setTimeout(() => {
            setOk(!ok);
        }, 300);
    };

    const showCategories = () => {
        return categories.map((category) => (
            <div key={category._id}>
                <Checkbox
                    className="pb-2 pl-4 pr-4"
                    value={category._id}
                    name="category"
                    onChange={handleCheckbox}
                    checked={categoryIds.includes(category._id)}
                >
                    {category.name}
                </Checkbox>
                <br />
            </div>
        ));
    };

    const handleCheckbox = (e) => {
        // Reset other filters
        // Reset other filters
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' },
        });
        setCategoryIds([]);
        setPrice([0, 999]);
        setStar('');
        setSubcategory('');
        setBrand('');
        setColor('');
        setShipping('');
        let inTheState = [...categoryIds];
        let justChecked = e.target.value;
        let foundInTheState = inTheState.indexOf(justChecked);

        if (foundInTheState === -1) {
            inTheState.push(justChecked);
        } else {
            inTheState.splice(foundInTheState, 1);
        }

        setCategoryIds(inTheState);
        // console.log(inTheState);
        fetchProducts({ category: inTheState });
    };

    const handleStarClick = (num) => {
        // Reset other filters
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' },
        });
        setCategoryIds([]);
        setPrice([0, 999]);
        setSubcategory('');
        setBrand('');
        setColor('');
        setShipping('');
        setStar(num);
        fetchProducts({ stars: num });
    };

    const showStars = () => {
        return (
            <div className="pr-4 pl-4 pb-2">
                <Star starClick={handleStarClick} numberOfStars={5} />
                <Star starClick={handleStarClick} numberOfStars={4} />
                <Star starClick={handleStarClick} numberOfStars={3} />
                <Star starClick={handleStarClick} numberOfStars={2} />
                <Star starClick={handleStarClick} numberOfStars={1} />
            </div>
        );
    };

    const showSubcategories = () => {
        return subcategories.map((subcategory) => (
            <div
                style={{ cursor: 'pointer' }}
                className="p-1 m-1 badge bg-primary"
                key={subcategory._id}
                onClick={() => handleSubcategory(subcategory)}
            >
                {subcategory.name}
            </div>
        ));
    };

    const handleSubcategory = (subcategory) => {
        // Reset other filters
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' },
        });
        setCategoryIds([]);
        setPrice([0, 999]);
        setStar('');
        setBrand('');
        setColor('');
        setShipping('');
        setSubcategory(subcategory);
        fetchProducts({ subcategory });
    };

    const showBrands = () => {
        return brands.map((b) => (
            <Radio
                key={b}
                value={b}
                name={b}
                checked={b === brand}
                onChange={handleBrand}
                className="pb-1 pl-4 pr-5"
            >
                {b}
            </Radio>
        ));
    };

    const handleBrand = (e) => {
        // Reset other filters
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' },
        });
        setCategoryIds([]);
        setPrice([0, 999]);
        setStar('');
        setSubcategory('');
        setColor('');
        setShipping('');
        setBrand(e.target.value);
        fetchProducts({ brand: e.target.value });
    };

    const showColors = () => {
        return colors.map((c) => (
            <Radio
                key={c}
                value={c}
                name={c}
                checked={c === color}
                onChange={handleColor}
                className="pb-1 pl-4 pr-5"
            >
                {c}
            </Radio>
        ));
    };

    const handleColor = (e) => {
        // Reset other filters
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' },
        });
        setCategoryIds([]);
        setPrice([0, 999]);
        setStar('');
        setSubcategory('');
        setBrand('');
        setShipping('');
        setColor(e.target.value);
        fetchProducts({ color: e.target.value });
    };

    const showShipping = () => {
        return (
            <>
                <Checkbox
                    className="pb-2 pl-4 pr-4"
                    onChange={handleShippingChange}
                    value="Yes"
                    checked={shipping === 'Yes'}
                >
                    Yes
                </Checkbox>
                <Checkbox
                    className="pb-2 pl-4 pr-4"
                    onChange={handleShippingChange}
                    value="No"
                    checked={shipping === 'No'}
                >
                    No
                </Checkbox>
            </>
        );
    };

    const handleShippingChange = (e) => {
        // Reset other filters
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' },
        });
        setCategoryIds([]);
        setPrice([0, 999]);
        setStar('');
        setSubcategory('');
        setBrand('');
        setColor('');
        setShipping(e.target.value);
        fetchProducts({ shipping: e.target.value });
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 pt-3">
                    <h4>Filter</h4>
                    <hr />
                    <Menu
                        mode="inline"
                        defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']}
                    >
                        <SubMenu
                            key="1"
                            title={
                                <span className="h6">
                                    <DollarOutlined /> Price
                                </span>
                            }
                        >
                            <div>
                                <Slider
                                    className="ml-4 mr-4"
                                    tipFormatter={(value) => `$${value}`}
                                    range
                                    value={price}
                                    onChange={handleSlider}
                                    max="999"
                                />
                            </div>
                        </SubMenu>
                        <SubMenu
                            key="2"
                            title={
                                <span className="h6">
                                    <DownSquareOutlined /> Categories
                                </span>
                            }
                        >
                            <div className="mt-10">{showCategories()}</div>
                        </SubMenu>
                        <SubMenu
                            key="3"
                            title={
                                <span className="h6">
                                    <StarOutlined /> Rating
                                </span>
                            }
                        >
                            <div className="mt-10">{showStars()}</div>
                        </SubMenu>
                        <SubMenu
                            key="4"
                            title={
                                <span className="h6">
                                    <DownSquareOutlined /> Subcategories
                                </span>
                            }
                        >
                            <div className="mt-10">{showSubcategories()}</div>
                        </SubMenu>
                        <SubMenu
                            key="5"
                            title={
                                <span className="h6">
                                    <FontColorsOutlined /> Brands
                                </span>
                            }
                        >
                            <div className="pl-4 pr-4 mt-10">
                                {showBrands()}
                            </div>
                        </SubMenu>
                        <SubMenu
                            key="6"
                            title={
                                <span className="h6">
                                    <BgColorsOutlined /> Colors
                                </span>
                            }
                        >
                            <div className="pl-4 pr-4 mt-10">
                                {showColors()}
                            </div>
                        </SubMenu>
                        <SubMenu
                            key="7"
                            title={
                                <span className="h6">
                                    <DeliveredProcedureOutlined /> Shipping
                                </span>
                            }
                        >
                            <div className="pl-4 pr-4 mt-10">
                                {showShipping()}
                            </div>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="col-md-9 pt-3">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4 className="text-danger">Products</h4>
                    )}
                    {products.length < 1 && <p>No products found</p>}
                    <div className="row">
                        {products.map((product) => (
                            <div key={product._id} className="col-md-4 mt-4">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
