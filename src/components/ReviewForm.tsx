import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createReview, Review } from '@/lib/reviews';

interface ReviewFormProps {
  bookingId: string;
  onSuccess: (review: Review) => void;
}

export default function ReviewForm({ bookingId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5 stars');
      return;
    }

    setIsSubmitting(true);
    try {
      const newReview = await createReview({
        bookingId,
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success('Review submitted successfully!');
      onSuccess(newReview);
    } catch (error: unknown) {
      console.error('Failed to submit review:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to submit review. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
          Rate your experience <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= (hoveredRating || rating);
            return (
              <button
                key={index}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoveredRating(starValue)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform duration-100 active:scale-90 hover:scale-110"
              >
                <Star
                  className={`h-7 w-7 ${
                    isFilled
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300 dark:text-slate-750'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="text-xs font-bold text-slate-700 dark:text-slate-350">
          Share details of your experience (optional)
        </label>
        <textarea
          id="comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did this professional do well? Any areas of improvement?"
          className="w-full bg-white/50 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-on-surface focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0 || isSubmitting}
        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-lg text-xs shadow-md hover:from-indigo-500 hover:to-violet-500 active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
