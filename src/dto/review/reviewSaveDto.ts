export class ReviewSaveDto {
  songId?: string;
  reviewerName?: string;
  rating?: number;
  comment?: string;
  publishDate?: Date;

  constructor(data: Partial<ReviewSaveDto>) {
    this.songId = data.songId;
    this.reviewerName = data.reviewerName;
    this.rating = data.rating;
    this.comment = data.comment;
    this.publishDate = data.publishDate;
  }
}