import { Trip } from '../types/trip';

export async function shareTrip(trip: Trip): Promise<boolean> {
  const shareData = {
    title: 'Share a taxi ride with CoTaxiage',
    text: `Join my taxi ride from ${trip.pickup.name} to ${trip.dropoff.name} on ${trip.scheduledFor.toLocaleDateString()}`,
    url: `${window.location.origin}/trip/${trip.id}`
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return true;
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
      window.open(shareUrl, '_blank');
      return true;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      // User cancelled sharing
      return false;
    }
    console.error('Error sharing:', error);
    return false;
  }
}