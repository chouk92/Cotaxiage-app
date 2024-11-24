import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { db } from '../../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface DriverRatingProps {
  bookingId: string;
  driverId: string;
}

export default function DriverRating({ bookingId, driverId }: DriverRatingProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to submit a review');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      const reviewRef = doc(db, 'reviews', bookingId);
      await setDoc(reviewRef, {
        rating,
        comment,
        userId: driverId,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorPhoto: user.photoURL,
        bookingId,
        createdAt: serverTimestamp()
      });
      
      toast.success('Thank you for your review!');
      setRating(0);
      setComment('');
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(
        error.code === 'permission-denied'
          ? 'You do not have permission to submit this review.'
          : 'Failed to submit review. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Rate your driver</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    value <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mb-4">
            {rating === 0 ? 'Select a rating' : `You rated ${rating} star${rating !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Share your experience..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || rating === 0}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}