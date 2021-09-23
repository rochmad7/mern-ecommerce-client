import React from 'react';
import Jumbotron from '../components/cards/Jumbotron';
import NewArrivals from '../components/home/NewArrivals';
import BestSellers from '../components/home/BestSellers';

const Home = () => {
    return (
        <>
            <div className="p-3 mb-5 bg-info h1 font-weight-bold text-center">
                <Jumbotron
                    text={['Latest Products', 'New Arrivals', 'Best Sellers']}
                />
            </div>
            <div className="text-center p-3 mt-5 mb-5 bg-info h1 font-weight-bold">
                New Arrivals
            </div>
            <NewArrivals />
            <div className="text-center p-3 mt-5 mb-5 bg-info h1 font-weight-bold">
                Best Sellers
            </div>
            <BestSellers />
        </>
    );
};

export default Home;
