import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document{
  songId: number;
  reviewerName: string;
  rating: number;
  comment: string;
  publishDate: Date;
}

const reviewSchema = new Schema({
  songId: {
    required: true,
    type: String,
  },
  reviewerName: {
    required: true,
    type: String,
  },
  rating: {
    required: true,
    type: Number,
  },
  comment: {
    required: true,
    type: String,
  },
  publishDate: {
    required: true,
    type: Date,
  },
},
{
  timestamps: true,
  timezone: 'UTC',
});

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;