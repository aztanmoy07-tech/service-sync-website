import React, { useState } from 'react';
import axios from 'axios';

const Reviews = ({ serviceId, reviews, refreshReviews }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const API_URL = 'https://service-sync-website.onrender.com';

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to write a review.");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/services/${serviceId}/reviews`, 
        { rating, comment },
        { headers: { 'x-auth-token': token } }
      );
      
      alert('Review Added!');
      setComment('');
      setRating(5);
      refreshReviews(); // Reload the page/data to show new review
    } catch (err) {
      alert('Error adding review.');
      console.error(err);
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>

      {/* Write a Review Form */}
      <form onSubmit={onSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <h4 className="font-bold text-sm mb-2 text-gray-700">Write a Review</h4>
        
        <div className="mb-2">
            <label className="block text-xs font-bold text-gray-500 uppercase">Rating</label>
            <select 
                value={rating} 
                onChange={e => setRating(e.target.value)}
                className="w-full p-2 border rounded mt-1 bg-white"
            >
                <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                <option value="4">⭐⭐⭐⭐ (Good)</option>
                <option value="3">⭐⭐⭐ (Average)</option>
                <option value="2">⭐⭐ (Poor)</option>
                <option value="1">⭐ (Terrible)</option>
            </select>
        </div>

        <textarea 
          className="w-full p-3 border rounded-lg mb-2"
          rows="2"
          placeholder="Share your experience..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          required
        ></textarea>

        <button type="submit" className="bg-black text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-800">
          Post Review
        </button>
      </form>

      {/* List of Reviews */}
      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((rev, index) => (
            <div key={index} className="bg-white p-4 shadow-sm rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-900">{rev.user}</span>
                <span className="text-yellow-500 text-sm">
                  {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{rev.comment}</p>
              <span className="text-xs text-gray-400 mt-2 block">
                {new Date(rev.date).toLocaleDateString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;