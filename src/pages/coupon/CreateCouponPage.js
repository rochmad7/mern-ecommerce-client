import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import AdminNav from '../../components/nav/AdminNav';
import { createCoupon, getCoupons, removeCoupon } from '../../functions/coupon';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DeleteOutlined } from '@ant-design/icons';

const CreateCouponPage = () => {
    const [name, setName] = useState('');
    const [expiration, setExpiration] = useState('');
    const [discount, setDiscount] = useState('');
    const [loading, setLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadAllCoupons();
    }, []);

    const loadAllCoupons = () => {
        getCoupons().then((res) => setCoupons(res.data));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        createCoupon({ name, expiration, discount }, user.token)
            .then((res) => {
                setLoading(false);
                setName('');
                setExpiration('');
                setDiscount('');
                toast.success(`Coupon ${res.data.name} created successfully`);
                loadAllCoupons();
            })
            .catch((err) => console.log('Create coupon failed', err));
    };

    const handleRemove = (couponId) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            setLoading(true);
            removeCoupon(couponId, user.token)
                .then((res) => {
                    loadAllCoupons();
                    setLoading(false);
                    toast.success(
                        `Coupon ${res.data.name} removed successfully`
                    );
                })
                .catch((err) => console.log(err));
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4>Coupon</h4>
                    )}
                    <form action="" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="" className="text-muted">
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                autoFocus
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="" className="text-muted">
                                Discount (%)
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                onChange={(e) => setDiscount(e.target.value)}
                                value={discount}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="" className="text-muted">
                                Expiration
                            </label>
                            <DatePicker
                                className="form-control"
                                selected={new Date()}
                                value={expiration}
                                onChange={(date) => setExpiration(date)}
                                required
                            />
                        </div>
                        <button className="btn btn-primary mt-3">Save</button>
                    </form>

                    <h4>{coupons.length} coupons available</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Expiration</th>
                                <th scope="col">Discount</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((c) => (
                                <tr key={c._id}>
                                    <td>{c.name}</td>
                                    <td>
                                        {new Date(
                                            c.expiration
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>{c.discount}%</td>
                                    <td>
                                        <DeleteOutlined
                                            onClick={() => handleRemove(c._id)}
                                            className="text-danger pointer"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CreateCouponPage;
