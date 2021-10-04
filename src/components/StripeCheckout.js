import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '../functions/stripe';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import { CheckOutlined, DollarOutlined } from '@ant-design/icons';

const StripeCheckout = () => {
    const { user, coupon } = useSelector((state) => ({ ...state }));

    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');

    const [cartTotal, setCartTotal] = useState(0);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [payable, setPayable] = useState(0);

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        createPaymentIntent(coupon, user.token).then((res) => {
            setClientSecret(res.data.clientSecret);
            setCartTotal(res.data.cartTotal);
            setTotalAfterDiscount(res.data.totalAfterDiscount);
            setPayable(res.data.payable);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: e.target.name.value,
                },
            },
        });

        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);
        } else {
            // console.log(JSON.stringify(payload, null, 4));
            setError(null);
            setSucceeded(true);
            setProcessing(false);
        }
    };

    const handleChange = async (e) => {
        setDisabled(e.empty);
        setError(e.error ? e.error.message : '');
    };

    const cardStyle = {
        style: {
            base: {
                color: '#32325d',
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#32325d',
                },
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
    };

    return (
        <>
            {!succeeded && (
                <div>
                    {coupon && totalAfterDiscount !== undefined ? (
                        <p className="alert alert-success">{`Total After Discount: ${totalAfterDiscount}`}</p>
                    ) : (
                        <p className="alert alert-danger">No coupon applied</p>
                    )}
                </div>
            )}
            <div className="text-center pb-5">
                <Card
                    cover={
                        <img
                            src="https://res.cloudinary.com/rochmad7/image/upload/v1631665297/sample.jpg"
                            alt=""
                            style={{
                                height: '200px',
                                objectFit: 'cover',
                                marginBottom: '-50px',
                            }}
                        />
                    }
                    actions={[
                        <>
                            <DollarOutlined className="text-info" />
                            <br />
                            Total: ${cartTotal}
                        </>,
                        <>
                            <CheckOutlined className="text-info" />
                            <br />
                            Total payable: ${(payable / 100).toFixed(2)}
                        </>,
                    ]}
                />
            </div>

            <form
                id="payment-form"
                className="stripe-form"
                onSubmit={handleSubmit}
            >
                <CardElement
                    id="card-element"
                    options={cardStyle}
                    onChange={handleChange}
                />
                <button
                    className="stripe-button"
                    disabled={processing || disabled || succeeded}
                >
                    <span id="button-text">
                        {processing ? (
                            <div className="spinner" id="spinner"></div>
                        ) : (
                            'Pay'
                        )}
                    </span>
                </button>
                <br />
                {error && <div className="card-error">{error}</div>}
                <br />
                <p
                    className={
                        succeeded ? 'result-message' : 'result-message hidden'
                    }
                >
                    Payment is successful.{' '}
                    <Link to="/user/history">
                        See in your transaction history
                    </Link>
                </p>
            </form>
        </>
    );
};

export default StripeCheckout;
