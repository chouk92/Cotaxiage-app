import { Timestamp } from 'firebase/firestore';

export function convertTimestampToDate(timestamp: Timestamp | null | undefined): Date | null {
  if (!timestamp || !(timestamp instanceof Timestamp)) {
    return null;
  }
  return timestamp.toDate();
}

export function formatFirestoreDate(date: Date | null): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Unknown date';
  }
  return date.toISOString();
}