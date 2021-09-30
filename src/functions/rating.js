import React from 'react';
// import StarRatings from 'react-star-ratings/src';
import StarRatings from 'react-star-ratings';

export const showAverage = (product) => {
    if (product && product.ratings) {
        let ratingArray = product && product.ratings;
        let total = [];
        let length = ratingArray.length;

        ratingArray.map((rating) => total.push(rating.star));
        let totalReduced = total.reduce((prev, next) => prev + next, 0);
        let highest = length * 5;
        let result = (totalReduced * 5) / highest;
        // console.log(result);

        return (
            <div className="text-center pt-1 pb-3">
                <span>
                    <StarRatings
                        rating={result}
                        starDimension="20px"
                        starSpacing="2px"
                        starRatedColor="red"
                        editing={false}
                    />
                    ({product.ratings.length})
                    {/*<Rating ratingValue={result} />*/}
                    {/*<Rate value={result}/>*/}
                </span>
            </div>
        );
    }
};
