import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './OrderPlacedSkeleton.css';

const OrderPlacedSkeleton = () => {
  return (
    <div className="order-placed-skeleton">
      <div className="skeleton-container">
        <div className="skeleton-cross">
          <Skeleton circle={true} height={64} width={64} />
        </div>

        <div className="skeleton-text-1">
          <Skeleton count={1} width={`80%`} />
        </div>

        <div className="skeleton-text-2">
          <Skeleton count={1} height={30} width={`60%`} />
          <Skeleton count={1} width={`50%`} />
        </div>

        <div className="skeleton-text-3">
          <Skeleton count={2} width={`80%`} />
        </div>

        <div className="skeleton-buttons">
          <Skeleton count={1} height={40} width={100} />
          <Skeleton count={1} height={40} width={100} />
        </div>
      </div>
    </div>
  );
};

export default OrderPlacedSkeleton;
