export interface Review {
  id: string;
  userId: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  rating: number;
  comment: string;
  bookingId?: string;
  createdAt: Date;
}