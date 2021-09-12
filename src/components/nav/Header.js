import React, { useState } from 'react';
import { Menu } from 'antd';
import {
    HomeOutlined,
    LogoutOutlined,
    SettingOutlined,
    UserAddOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';

const { SubMenu, Item } = Menu;

const Header = () => {
    const [current, setCurrent] = useState('home');

    let dispatch = useDispatch();
    let { user } = useSelector((state) => ({ ...state }));

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
            {user && (
                <SubMenu
                    key="SubMenu"
                    icon={<SettingOutlined />}
                    title={user.email && user.email.split('@')[0]}
                    style={{ marginLeft: 'auto' }}
                >
                    <Item key="setting:1">Option 1</Item>
                    <Item key="setting:2">Option 2</Item>
                    <Item icon={<LogoutOutlined />} onClick={logout}>
                        Logout
                    </Item>
                </SubMenu>
            )}

            {!user && (
                <Item
                    key="register"
                    icon={<UserAddOutlined />}
                    style={{ marginLeft: 'auto' }}
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
