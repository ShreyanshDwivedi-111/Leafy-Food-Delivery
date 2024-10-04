import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './SkeletonFoodItem.css'; 

const SkeletonFoodItem = ({ count }) => {
  return (
    <div className="skeleton-food-list">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-food-item">
          <div className="skeleton-food-img-container">
            <Skeleton height={150} width={210} />
          </div>
          <div className="skeleton-food-info">
            <div className="skeleton-food-name-rating">
              <Skeleton width={100} />
              <Skeleton width={70} height={30} />
            </div>
            <Skeleton count={2} width={150} />
            <div className="skeleton-food-add-cart">
              <Skeleton width={60} height={30} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <Skeleton width={80} height={30} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonFoodItem;
