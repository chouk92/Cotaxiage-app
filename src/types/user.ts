export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  bio: string | null;
  phoneNumber: string | null;
  isPublic: boolean;
  createdAt: Date | null;
  lastLoginAt: Date | null;
  settings?: {
    isPublic: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
}

export interface ProfileSettings {
  isPublic: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}