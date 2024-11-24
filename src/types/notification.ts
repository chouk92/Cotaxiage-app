export interface Notification {
  id: string;
  userId: string;
  tripId?: string;
  type: 'trip_update' | 'trip_cancelled' | 'participant_joined' | 'participant_left';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}