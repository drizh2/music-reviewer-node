export interface ReviewDto {
  _id: string,
  songId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  publishDate: Date;
}