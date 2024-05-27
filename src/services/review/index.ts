import Review, {IReview} from "../../model/review";
import axios from "axios";
import {ReviewSaveDto} from "../../dto/review/reviewSaveDto";

const http = axios.create({
  baseURL: 'http://10.31.26.126:8080/api',
});

export const createReview = async (
  reviewSaveDto: ReviewSaveDto
): Promise<string> => {
  await validateReview(reviewSaveDto);

  if (!reviewSaveDto.publishDate) {
    reviewSaveDto.publishDate = new Date();
  }
  const review = await new Review(reviewSaveDto).save();
  return review._id;
};

export const getReviewsBySongId = async (songId: string, size: number, from: number): Promise<IReview[]> => {
  try {
    return await Review.find({ songId })
      .sort({ publishDate: -1 })
      .skip(from)
      .limit(size)
      .exec();
  } catch (err) {
    throw new Error(`Error fetching reviews for songId ${songId}: ${err}`);
  }
};

export const getReviewCountsBySongIds = async (songIds: string[]): Promise<Record<string, number>> => {
  try {
    const counts = await Review.aggregate([
      {
        $match: {
          songId: { $in: songIds },
        },
      },
      {
        $group: {
          _id: '$songId',
          count: { $sum: 1 },
        },
      },
    ]);

    const result: Record<string, number> = {};
    counts.forEach(item => {
      result[item._id] = item.count;
    });

    songIds.forEach(songId => {
      if (!result[songId]) {
        result[songId] = 0;
      }
    });

    return result;
  } catch (error) {
    throw new Error(`Error fetching review counts: ${error}`);
  }
};

export const validateReview = async (reviewDto: ReviewSaveDto) => {
  const id = reviewDto.songId;

  const { data } = await http.get(`/songs/${id}`);

  if (!data) {
    throw new Error(`${data.message}`);
  }
};