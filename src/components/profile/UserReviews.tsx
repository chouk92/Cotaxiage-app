import React from 'react';
import ReviewList from '../reviews/ReviewList';

interface UserReviewsProps {
  userId: string;
}

export default function UserReviews({ userId }: UserReviewsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Reviews</h2>
      <ReviewList userId={userId} />
    </div>
  );
}