import React, { useState } from 'react';
import { Badge, Menu } from 'antd';
import {
    HomeOutlined,
    LogoutOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    UserAddOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';
import Search from '../forms/Search';

const { SubMenu, Item } = Menu;

const Header = () => {
    const [current, setCurrent] = useState('home');

    let dispatch = useDispatch();
    let { user, cart } = useSelector((state) => ({ ...state }));

    let history = useHistory();

    const handleClick = (e) => {
        setCurrent(e.key);
    };

    const logout = () => {
        firebase.auth().signOut();
        dispatch({
            type: 'LOGOUT',
            payload: null,
        });
        history.push('/login');
    };

    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Item key="home" icon={<HomeOutlined />}>
                <Link to="/">Home</Link>
            </Item>
            <Item key="shop" icon={<ShoppingOutlined />}>
                <Link to="/shop">Shop</Link>
            </Item>
            <Item key="cart" icon={<ShoppingCartOutlined />}>
                <Link to="/cart">
                    <Badge count={cart.length} offset={[9, 0]}>
                        Cart
                    </Badge>
                </Link>
            </Item>
            <Item key="search">
                <Search />
            </Item>
            {user && (
                <SubMenu
                    key="SubMenu"
                    icon={<SettingOutlined />}
                    title={user.email && user.email.split('@')[0]}
                    className="ms-auto"
                >
                    {user && user.role === 'subscriber' && (
                        <Item>
                            <Link to="/user/history">Dashboard</Link>
                        </Item>
                    )}
                    {user && user.role === 'admin' && (
                        <Item>
                            <Link to="/admin/dashboard">Dashboard</Link>
                        </Item>
                    )}
                    <Item icon={<LogoutOutlined />} onClick={logout}>
                        Logout
                    </Item>
                </SubMenu>
            )}

            {!user && (
                <Item
                    key="register"
                    icon={<UserAddOutlined />}
                    className="ms-auto"
                >
                    <Link to="/register">Register</Link>
                </Item>
            )}
            {!user && (
                <Item key="login" icon={<UserOutlined />} className="float-end">
                    <Link to="/login">Login</Link>
                </Item>
            )}
        </Menu>
    );
};

export default Header;
